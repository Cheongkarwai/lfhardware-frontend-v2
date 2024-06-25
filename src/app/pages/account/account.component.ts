import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {TuiAvatarModule, TuiTagModule} from "@taiga-ui/kit";
import {LoginService} from "../../core/user/login.service";
import {map, Observable, Subject} from "rxjs";
import {UserService} from "../../core/user/user.service";
import {AlertService} from "../../core/service/alert.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Validator} from "../../core/validator";
import {ButtonComponent} from "../../components/button/button.component";
import {MapComponent} from "../../components/map/map.component";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import {PhoneInputComponent} from "../../components/phone-input/phone-input.component";
import {Status} from "../../components/alert-dialog/alert-dialog.component";
import {ZipcodeInputComponent} from "../../components/zipcode-input/zipcode-input.component";
import {UserProfile} from "../../core/user/user.profile";
import {UserAccount} from "../../core/user/user-account.interface";
import {AccountService} from "../../core/user/account.service";
import {ProductService} from "../../core/product/product.service";
import {MatDialogModule} from "@angular/material/dialog";
import {SecurityComponent} from "./security/security.component";
import {ProfileComponent} from "./profile/profile.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ProviderService} from "../../core/service-provider/service-provider.service";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    NgbDropdownToggle,
    TuiAvatarModule,
    TuiTagModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    MapComponent,
    LeafletModule,
    PhoneInputComponent,
    ZipcodeInputComponent,
    MatDialogModule,
    SecurityComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit, AfterViewInit {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Profile',
      routerLink: '/profile'
    },
  ];
  // user$!: Observable<UserAccount | null>;

  // userProfileForm: FormGroup;

  selectedTab: string = 'profile';

  // @ViewChild('phoneInput') phoneInput!: PhoneInputComponent;

  // $destroy: Subject<void> = new Subject<void>();

  constructor(private loginService: LoginService,
              private userService: UserService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private router: Router,
              private providerService: ProviderService) {

    this.providerService.findPaymentAccountStatus().subscribe({
      next:res=>console.log(res)
    })
    // this.userProfileForm = this.fb.group({
    //   username: ['',
    //     //[Validators.required, Validators.pattern('\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*')], [Validator.createUsernameValidator(this.userService)]
    //   ],
    //   profile: this.fb.group({
    //     phone_number: ['', [Validators.required]],
    //     email_address: [''],
    //     address: this.fb.group({
    //       line_1: ['', Validators.required],
    //       line_2: [''],
    //       city: ['', [Validators.required]],
    //       state: ['', [Validators.required]],
    //       zipcode: ['', Validators.required]
    //     })
    //   }),
    // });
  }


  ngOnInit() {
    // this.user$ = this.accountService.findCurrentlyLoggedInUser()
    //   .pipe(map(user => {
    //     this.userProfileForm.patchValue(user);
    //     return user;
    //   }));
  }

  ngAfterViewInit() {

    // this.userService.findUserAccountByUsername(this.auth.currentUser?.email).pipe(map(user => {
    //   user.profile.phone_number = user.profile.phone_number ? user.profile.phone_number.substring(3, user.profile.phone_number.length) : '';
    //   return user;
    // })).subscribe({
    //   next: user => {
    //     this.userProfileForm.patchValue(user);
    //     this.alertUpdateProfile();
    //   },
    //   error: err => console.log(err)
    // });
  }

  alertUpdateProfile() {
    // this.userProfileForm.markAllAsTouched();
    // if (this.phoneNumberControl.getRawValue() === '') {
    //   this.phoneNumberControl.setAsyncValidators(Validator.createPhoneNumberWithPrefixValidator(this.phoneInput.prefix, this.userService));
    // }
    // console.log(this.userProfileForm);
    // console.log(this.userProfileForm.valid);
    //
    // if (this.userProfileForm.invalid) {
    //   this.alertService.show$.next(true);
    //   this.alertService.showAlert('Complete your profile', 'Please fill in all the necessary fields to complete your account profile.', Status.WARNING);
    // }
  }


  verifyEmail(user: UserAccount) {
    if (!user.email_verified) {
      this.userService.verifyEmail(user.profile.email_address as string).subscribe({
        next: res =>
          this.alertService.showSuccess('An email verification link has sent to your email. Please verify it.'),
        error: err => this.alertService.showError('There is something wrong. Please try again later')
      });
    }
  }

  // get emailAddressControl() {
  //   return this.userProfileForm.get('profile')?.get('email_address') as FormControl;
  // }
  //
  // get phoneNumberControl() {
  //   return this.userProfileForm.get('profile')?.get('phone_number') as FormControl;
  // }
  //
  // get usernameControl() {
  //   return this.userProfileForm.controls['username'] as FormControl;
  // }
  //
  // get passwordControl() {
  //   return this.userProfileForm.controls['password'] as FormControl;
  // }
  //
  // get addressLine1Control() {
  //   return this.userProfileForm.get('profile')?.get('address')?.get('line_1') as FormControl;
  // }
  //
  // get addressLine2Control() {
  //   return this.userProfileForm.get('profile')?.get('address')?.get('line_2') as FormControl;
  // }
  //
  // get stateControl() {
  //   return this.userProfileForm.get('profile')?.get('address')?.get('state') as FormControl;
  // }
  //
  // get cityControl() {
  //   return this.userProfileForm.get('profile')?.get('address')?.get('city') as FormControl;
  // }
  //
  // get zipcodeControl() {
  //   return this.userProfileForm.get('profile')?.get('address')?.get('zipcode') as FormControl;
  // }
  //
  //
  // onMapReady(map: any) {
  //   const provider = new OpenStreetMapProvider();
  //   // @ts-ignore
  //   const search = new GeoSearchControl({
  //     provider: provider,
  //   });
  //   search.addTo(map);
  // }

  // get isShowingAlert() {
  //   return this.alertService.show$.asObservable();
  // }
  //
  // ngOnDestroy() {
  //   // this.alertService.show = false;
  //   this.$destroy.next();
  //   this.$destroy.complete();
  // }

  logout() {
    this.loginService.logout().subscribe(res => {
      window.location.href = res.headers.get('Location') as string;
      this.router.navigate(['']).then(res => {
      });
    }, error => {

    });
  }

  switchTab(tabName: string) {
    this.selectedTab = tabName;
  }


}
