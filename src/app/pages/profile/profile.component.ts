import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {TuiAvatarModule, TuiTagModule} from "@taiga-ui/kit";
import {Auth, updateProfile, User as FirebaseUser} from "@angular/fire/auth";
import {LoginService} from "../../core/user/login.service";
import {catchError, map, Observable, of, Subject, takeUntil} from "rxjs";
import {UserService} from "../../core/user/user.service";
import {AlertService} from "../../core/service/alert.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Validator} from "../../core/validator";
import {ButtonComponent} from "../../components/button/button.component";
import {MapComponent} from "../../components/map/map.component";
import {latLng, marker, tileLayer} from 'leaflet';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import {PhoneInputComponent} from "../../components/phone-input/phone-input.component";
import {AlertDialogComponent, Status} from "../../components/alert-dialog/alert-dialog.component";
import {ZipcodeInputComponent} from "../../components/zipcode-input/zipcode-input.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {UserProfile} from "../../core/user/user.profile";
import {UserAccount} from "../../core/user/user-account.interface";

@Component({
  selector: 'app-profile',
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
    AlertDialogComponent,
    ZipcodeInputComponent,
    ChangePasswordComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  layers = [
    marker([46.879966, -121.726909])
  ];

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
    ],
    zoom: 16,
    center: latLng(46.879966, -121.726909)
  };

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
  //private auth = inject(Auth);

  user$!: Observable<FirebaseUser | null>;

  userProfileForm: FormGroup;

  selectedTab: string = 'profile';

  @ViewChild('phoneInput') phoneInput!: PhoneInputComponent;

  $destroy: Subject<void> = new Subject<void>();

  constructor(private loginService: LoginService, private auth: Auth, private userService: UserService, private alertService: AlertService,
              private fb: FormBuilder, private router: Router) {

    this.userProfileForm = this.fb.group({
      username: ['',
        //[Validators.required, Validators.pattern('\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*')], [Validator.createUsernameValidator(this.userService)]
      ],
      profile: this.fb.group({
        phone_number: ['', [Validators.required]],
        email_address:[''],
        address: this.fb.group({
          address_line_1: ['', Validators.required],
          address_line_2: [''],
          city: ['', [Validators.required]],
          state: ['', [Validators.required]],
          zipcode: ['', Validators.required]
        })
      }),
    });
  }


  ngOnInit() {
    // this.userProfileForm.disable();


    this.user$ = of(this.auth.authStateReady()).pipe(map(e => {
      this.usernameControl.setValue(this.auth.currentUser?.email);
      this.emailAddressControl.setValue(this.auth.currentUser?.email);
      this.phoneNumberControl.setValue(this.auth.currentUser?.phoneNumber ? this.auth.currentUser?.phoneNumber : '');
      this.addressLine1Control.setValue('');
      return this.auth.currentUser
    }), catchError(err => of(null)));
    // this.user$ = this.loginService.user;

    // this.phoneNumberControl.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(res=>{
    //   if(res){
    //     this.phoneNumberControl.setValue(this.phoneInput + res);
    //   }
    // })
  }

  ngAfterViewInit() {

    this.userService.findUserAccountByUsername(this.auth.currentUser?.email).pipe(map(user=>{
      user.profile.phone_number = user.profile.phone_number ? user.profile.phone_number.substring(3, user.profile.phone_number.length) : '';
      return user;
    })).subscribe({
      next:user=>{
        this.userProfileForm.patchValue(user);
        this.alertUpdateProfile();
      },
      error:err=> console.log(err)
    });
  }

  alertUpdateProfile(){
    this.userProfileForm.markAllAsTouched();
    if(this.phoneNumberControl.getRawValue() === ''){
      this.phoneNumberControl.setAsyncValidators(Validator.createPhoneNumberWithPrefixValidator(this.phoneInput.prefix,this.userService));
    }
    console.log(this.userProfileForm);
    console.log(this.userProfileForm.valid);

    if (this.userProfileForm.invalid) {
      this.alertService.show$.next(true);
      this.alertService.showAlert('Complete your profile', 'Please fill in all the necessary fields to complete your account profile.', Status.WARNING);
    }
  }


  verifyEmail(user: FirebaseUser) {
    if (!user.emailVerified) {
      console.log(user.email);
      this.userService.verifyEmail(user.email as string).subscribe({
        next: res =>
          this.alertService.showSuccess('An email verification link has sent to your email. Please verify it.'),
        error: err => this.alertService.showError('There is something wrong. Please try again later')
      });
    }
  }

  get emailAddressControl(){
    return this.userProfileForm.get('profile')?.get('email_address') as FormControl;
  }

  get phoneNumberControl() {
    return this.userProfileForm.get('profile')?.get('phone_number') as FormControl;
  }

  get usernameControl() {
    return this.userProfileForm.controls['username'] as FormControl;
  }

  get passwordControl() {
    return this.userProfileForm.controls['password'] as FormControl;
  }

  get addressLine1Control() {
    return this.userProfileForm.get('profile')?.get('address')?.get('address_line_1') as FormControl;
  }

  get addressLine2Control() {
    return this.userProfileForm.get('profile')?.get('address')?.get('address_line_2') as FormControl;
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


  onMapReady(map: any) {
    const provider = new OpenStreetMapProvider();
    // @ts-ignore
    const search = new GeoSearchControl({
      provider: provider,
    });
    search.addTo(map);
  }

  get isShowingAlert() {
    return this.alertService.show$.asObservable();
  }

  ngOnDestroy() {
    // this.alertService.show = false;
    this.$destroy.next();
    this.$destroy.complete();
  }

  logout() {
    this.loginService.logout().then(res => {
      this.router.navigate(['']).then(res => {
        location.reload()
      });
    }, error => console.log(error));
  }

  switchTab(tabName: string) {
    this.selectedTab = tabName;
  }

  updateProfile() {

    this.userProfileForm.markAllAsTouched();

    const userProfile: UserProfile = this.userProfileForm.getRawValue();

    userProfile.profile.phone_number = this.phoneInput.prefix + userProfile.profile.phone_number ;

    if (this.userProfileForm.valid) {
      this.userService.updateUser(userProfile)
        .subscribe({
          next: res => {
            console.log(res)
          }, error: err => console.log(err)
        })
      ;
    }
  }
}
