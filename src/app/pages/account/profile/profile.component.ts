import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {PhoneInputComponent} from "../../../components/phone-input/phone-input.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ZipcodeInputComponent} from "../../../components/zipcode-input/zipcode-input.component";
import {map, Observable} from "rxjs";
import {UserAccount} from "../../../core/user/user-account.interface";
import {LoginService} from "../../../core/user/login.service";
import {UserService} from "../../../core/user/user.service";
import {AlertService} from "../../../core/service/alert.service";
import {Router} from "@angular/router";
import {AccountService} from "../../../core/user/account.service";
import {ProductService} from "../../../core/product/product.service";
import {UserProfile} from "../../../core/user/user.profile";
import {ToastService} from "../../../core/dialog/toast.service";
import {TextInputComponent} from "../../../components/text-input/text-input.component";
import {Status} from "../../../components/alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    PhoneInputComponent,
    ReactiveFormsModule,
    ZipcodeInputComponent,
    TextInputComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user$!: Observable<UserAccount | null>;

  userProfileForm: FormGroup;

  constructor(private loginService: LoginService,
              private userService: UserService,
              private toastService: ToastService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private router: Router,
              private accountService: AccountService,
              private productService: ProductService) {

    this.userProfileForm = this.fb.group({
      username: ['',
        //[Validators.required, Validators.pattern('\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*')], [Validator.createUsernameValidator(this.userService)]
      ],
      profile: this.fb.group({
        phone_number: ['', Validators.required],
        phone_number_prefix: ['', Validators.required],
        email_address: [''],
        address: this.fb.group({
          line_1: ['', Validators.required],
          line_2: [''],
          city: ['', [Validators.required]],
          state: ['', [Validators.required]],
          zipcode: ['', Validators.required]
        })
      }),
    });
  }

  ngOnInit() {
    this.user$ = this.accountService.findCurrentlyLoggedInUser()
      .pipe(map(user => {
        this.userProfileForm.patchValue(user);
        return user;
      }));
  }

  get emailAddressControl() {
    return this.userProfileForm.get('profile')?.get('email_address') as FormControl;
  }

  get phoneNumberControl() {
    return this.userProfileForm.get('profile')?.get('phone_number') as FormControl;
  }

  get phonePrefixControl() {
    return this.userProfileForm.get('profile')?.get('phone_number_prefix') as FormControl;
  }

  get usernameControl() {
    return this.userProfileForm.controls['username'] as FormControl;
  }

  get passwordControl() {
    return this.userProfileForm.controls['password'] as FormControl;
  }

  get addressLine1Control() {
    return this.userProfileForm.get('profile')?.get('address')?.get('line_1') as FormControl;
  }

  get addressLine2Control() {
    return this.userProfileForm.get('profile')?.get('address')?.get('line_2') as FormControl;
  }

  get stateControl() {
    return this.userProfileForm.get('profile')?.get('address')?.get('state') as FormControl;
  }

  get cityControl() {
    return this.userProfileForm.get('profile')?.get('address')?.get('city') as FormControl;
  }

  get zipcodeControl() {
    return this.userProfileForm.get('profile')?.get('address')?.get('zipcode') as FormControl;
  }

  verifyEmail(user: UserAccount) {
    if (!user.email_verified) {
      this.userService.verifyEmail(user.profile.email_address as string).subscribe({
        next: res => this.toastService.open('An email verification link has sent to your email. Please check your inbox.', 'success'),
        error: err => this.toastService.open('There is something wrong. Please try again later', 'error')
      });
    }
  }

  updateProfile() {

    this.userProfileForm.markAllAsTouched();

    if (this.userProfileForm.valid) {
      this.userService.updateUser(this.userProfileForm.getRawValue())
        .subscribe({
          next: res => {
            this.toastService.open('Your profile information is updated', 'success');
          }, error: err => {
            this.toastService.open('Something went wrong when updating your profile information', 'error');
          }
        });
    } else {
      this.toastService.open('Please complete all the required fields', 'error');
    }
  }
}
