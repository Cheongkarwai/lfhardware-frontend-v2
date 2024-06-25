import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {UserService} from "../../../core/user/user.service";
import {AlertService} from "../../../core/service/alert.service";
import {AlertDialogComponent, Status} from "../../../components/alert-dialog/alert-dialog.component";
import {Validator} from "../../../core/validator";
import {of} from "rxjs";
import {AccountService} from "../../../core/user/account.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {LoginService} from "../../../core/user/login.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../core/dialog/toast.service";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
    confirm_password: ['', [Validators.required]]
  });

  passwordRequirements: { pass: boolean, text: string }[] = [{
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


  constructor(private fb: FormBuilder, private userService: UserService,
              private accountService: AccountService, private matDialog: MatDialog,
              private loginService: LoginService,
              private router: Router,
              private toastService: ToastService) {

    this.changePasswordForm.addValidators(Validator.matchingPasswordValidator(this.passwordControl, this.confirmPasswordControl));
  }

  ngOnInit() {


    this.passwordControl.valueChanges.subscribe((res: string) => {
      if (res) {
        if (res.length > 8) {
          this.passwordRequirements[0].pass = true;
        } else {
          this.passwordRequirements[0].pass = false;
        }
        if (res.match(/[a-z]/)) {
          this.passwordRequirements[1].pass = true;
        } else {
          this.passwordRequirements[1].pass = false;
        }
        if (res.match('^.*[A-Z].*$')) {
          this.passwordRequirements[2].pass = true;
        } else {
          this.passwordRequirements[2].pass = false;
        }
        if (res.match('^.*\\d.*$')) {
          this.passwordRequirements[3].pass = true;
        } else {
          this.passwordRequirements[3].pass = false;
        }
        if (res.match('^.*[^\\w\\s].*$')) {
          this.passwordRequirements[4].pass = true;
        } else {
          this.passwordRequirements[4].pass = false;
        }
      } else {
        for (const passwordRequirement of this.passwordRequirements) {
          passwordRequirement.pass = false;
        }
      }
    })
  }

  resetPassword() {

    this.changePasswordForm.markAllAsTouched();

    if (this.changePasswordForm.valid) {
      this.accountService.resetPassword(this.changePasswordForm.getRawValue())
        .subscribe({
          next: res => {
            this.matDialog.open(AlertDialogComponent, {
              data: {
                title: 'Password Update',
                text: 'Your password has been updated. Please login again.',
                status: Status.SUCCESS
              }
            }).afterClosed().subscribe(res => {
              this.loginService.logout().subscribe(res => {
                window.location.href =res.headers.get('Location') as string;
              }, error => {

              });
            });
          },
          error: err => {
            this.matDialog.open(AlertDialogComponent,
              {
                data: {
                  title: err.error.error,
                  text: err.error.error_description,
                  status: Status.ERROR
                }
              });
          }
        });
    }else{
      this.toastService.open('Please fill in all the required fields', 'error');
    }
  }

  get passwordControl() {
    return this.changePasswordForm.controls['password'] as FormControl;
  }

  get confirmPasswordControl() {
    return this.changePasswordForm.controls['confirm_password'] as FormControl;
  }


}
