import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder, FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AlertService} from "../../../core/service/alert.service";
import {UserService} from "../../../core/user/user.service";
import {catchError, map, Observable, of, take} from "rxjs";
import {TuiErrorModule} from "@taiga-ui/core";
import {TuiFieldErrorPipeModule} from "@taiga-ui/kit";
import {Validator} from "../../../core/validator";
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule,
    CommonModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  faGoogle = faGoogle;



  signUpForm:FormGroup;
  constructor(private fb:FormBuilder,private router:Router,private alertService:AlertService,
              private userService:UserService) {
    this.signUpForm = this.fb.group({
      username:['',[Validators.required, Validators.pattern('\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*')],[Validator.createUsernameValidator(this.userService)]],
      profile:this.fb.group({
        phone_number:['',[Validators.required],[Validator.createPhoneNumberValidator(this.userService)]],
        // email_address:['']
        address:this.fb.group({
          address_line_1:['', Validators.required],
          address_line_2:[''],
          city:['',[Validators.required]],
          state:['',[Validators.required]],
          zipcode: ['', Validators.required]
        })
      }),
      roles:this.fb.array([
        this.fb.group({
          name:'CUSTOMER'
        })
      ]),
      password:['',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]]
    });
  }

  ngOnInit(): void {
  }
  signUp(){
    this.signUpForm.markAllAsTouched();
    if(this.signUpForm.valid){
      this.userService.createNewAccount(this.signUpForm.getRawValue(), false)
        .subscribe({
          next:res=>{
            this.alertService.showSuccess('Successfully registered');
            this.userService.verifyEmail('cheongkarwai10@gmail.com').subscribe();
            this.router.navigate(['auth','login'])
          },
          error:err=>{
            this.alertService.showError(err.error.message)
          }
        });
    }
  }

  get phoneNumberControl(){
    return this.signUpForm.get('profile')?.get('phone_number') as FormControl;
  }

  get usernameControl(){
    return this.signUpForm.controls['username']  as FormControl;
  }

  get passwordControl(){
    return this.signUpForm.controls['password'] as FormControl;
  }

  get addressLine1Control(){
    return this.signUpForm.get('profile')?.get('address')?.get('address_line_1') as FormControl;
  }

  get addressLine2Control(){
    return this.signUpForm.get('profile')?.get('address')?.get('address_line_2') as FormControl;
  }

  get stateControl(){
    return this.signUpForm.get('profile')?.get('address')?.get('state') as FormControl;
  }

  get cityControl(){
    return this.signUpForm.get('profile')?.get('address')?.get('city') as FormControl;
  }

  get zipcodeControl(){
    return this.signUpForm.get('profile')?.get('address')?.get('zipcode') as FormControl;
  }


}

