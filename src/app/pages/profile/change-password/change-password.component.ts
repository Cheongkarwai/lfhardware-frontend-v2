import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder, FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {UserService} from "../../../core/user/user.service";
import {AlertService} from "../../../core/service/alert.service";
import {Status} from "../../../components/alert-dialog/alert-dialog.component";
import {Validator} from "../../../core/validator";
import {EmailAuthProvider, Auth, reauthenticateWithCredential, User} from "@angular/fire/auth";
import {from, lastValueFrom, map, of, switchMap} from "rxjs";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{

  changePasswordForm = this.fb.group({
    current_password: ['', [Validators.required]],
    password: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
    confirm_password: ['', [Validators.required]]
  });

  passwordRequirements:{pass:boolean, text: string}[] =  [{
    pass: false,
    text: ' At least 8 characters'
  },
    {
      pass: false,
      text: 'At least one lowercase character'
    },
    {
      pass: false,
      text: 'At least one uppercase character'
    },
    {
      pass: false,
      text: 'At least one number'
    },
    {
      pass: false,
      text: 'At least one special character, e.g., ! @ # ?'
    }];


  constructor(private fb: FormBuilder, private userService: UserService, private alertService: AlertService,
              private auth: Auth) {

    this.changePasswordForm.addValidators(Validator.matchingPasswordValidator(this.passwordControl, this.confirmPasswordControl));
  }

  ngOnInit() {
    this.passwordControl.valueChanges.subscribe((res :string)=> {
      if(res){
        if(res.length > 8){
          this.passwordRequirements[0].pass = true;
        }else{
          this.passwordRequirements[0].pass = false;
        }
        if(res.match(/[a-z]/)){
          this.passwordRequirements[1].pass = true;
        }else{
          this.passwordRequirements[1].pass = false;
        }
        if(res.match('^.*[A-Z].*$')){
          this.passwordRequirements[2].pass = true;
        }else{
          this.passwordRequirements[2].pass = false;
        }
        if(res.match('^.*\\d.*$')){
          this.passwordRequirements[3].pass = true;
        }else{
          this.passwordRequirements[3].pass = false;
        }
        if(res.match('^.*[^\\w\\s].*$')){
          this.passwordRequirements[4].pass = true;
        }else{
          this.passwordRequirements[4].pass = false;
        }
      }else{
        for(const passwordRequirement of this.passwordRequirements){
          passwordRequirement.pass = false;
        }
      }
    })
  }

  resetPassword() {

    this.auth.authStateReady().then(res=>{
      const user = this.auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user?.email as string,
        this.currentPasswordControl.getRawValue() as string
      )
      const authenticatedCredentials = from(reauthenticateWithCredential(user as User, credential))

      authenticatedCredentials.subscribe(res=>console.log(res));

    })

    this.changePasswordForm.markAllAsTouched();
    console.log(this.changePasswordForm);
    if (this.changePasswordForm.valid) {
      this.userService.changePassword("", this.changePasswordForm.getRawValue())
        .subscribe({
          next: res => {
            this.alertService.showAlert('Your password has been changed. Please login again.', 'text', Status.SUCCESS);
          },
          error: err => {
            this.alertService.showAlert('Something went wrong', 'text', Status.ERROR);
          }
        });
    }
  }

  get currentPasswordControl() {
    return this.changePasswordForm.controls['current_password'] as FormControl;
  }

  get passwordControl(){
    return this.changePasswordForm.controls['password'] as FormControl;
  }

  get confirmPasswordControl(){
    return this.changePasswordForm.controls['confirm_password'] as FormControl;
  }

  verifyCurrentPassword(): AsyncValidatorFn {
    // const reauthenticate = currentPassword => {
    //   const user = firebase.auth().currentUser;
    //   const cred = firebase.auth.EmailAuthProvider.credential(
    //     user.email, currentPassword);
    //   return user.reauthenticateAndRetrieveDataWithCredential(cred);
    // }
    return (control: AbstractControl) => {

      const userReadyState = from(this.auth.authStateReady());

      const authenticatedCredentials = userReadyState.pipe(switchMap(e=>{
        const user = this.auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user?.email as string,
          control.value as string
        )
        return from(reauthenticateWithCredential(user as User, credential))
      }));
        // .pipe(map(credential => {
        //   return credential ? null : {verify: false}
        // }));
      console.log(authenticatedCredentials);

      return authenticatedCredentials;
    }
  }
}
