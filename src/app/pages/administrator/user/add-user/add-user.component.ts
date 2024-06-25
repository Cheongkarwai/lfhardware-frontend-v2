import {Component, Inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MultipleFileUploadComponent} from "../../../../components/multiple-file-upload/multiple-file-upload.component";
import {Validator} from "../../../../core/validator";
import {StateService} from "../../../../core/state/state.service";
import {CityService} from "../../../../core/city/city.service";
import {forkJoin, map, Observable, Subject} from "rxjs";
import {City} from "../../../../core/city/city.interface";
import {State} from "../../../../core/state/state.interface";
import {UserService} from "../../../../core/user/user.service";
import {AlertService} from "../../../../core/service/alert.service";
import {Status} from "../../../../components/alert-dialog/alert-dialog.component";
import {Role} from "../../../../core/user/role.interface";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {DialogSubscriptionService} from "../../../../core/dialog/dialog.service";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {TuiDialogContext} from "@taiga-ui/core";
import {UserAccount} from "../../../../core/user/user-account.interface";

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule,
    MultipleFileUploadComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {


  addUserForm: FormGroup;

  showLoading: boolean = false;

  formObservables$: Observable<[Role[], City[], State[]]>;

  constructor(private fb: FormBuilder, private stateService: StateService, private cityService: CityService, private userService: UserService,
              private alertService: AlertService, private dialogSubscriptionService: DialogSubscriptionService) {
    this.addUserForm = this.fb.group({
      username: ['', [Validators.required, Validator.noWhitespaceValidator], Validator.createUsernameValidator(this.userService)],
      password: ['', [Validators.required, Validator.noWhitespaceValidator]],
      roles: [[], Validators.required],
      profile: this.fb.group({
        email_address: [''],
        phone_number: ['', [Validators.required, Validator.noWhitespaceValidator], Validator.createPhoneNumberValidator(this.userService)],
        address: this.fb.group({
          address_line_1: [''],
          address_line_2: [''],
          state: ['', Validators.required],
          city: ['', Validators.required],
          zipcode: ['', [Validators.required, Validator.noWhitespaceValidator]],
          country: ['']
        })
      })
    });

    this.formObservables$ = forkJoin([this.userService.findAllCurrentUserRoles(), this.cityService.findAll(), this.stateService.findAll()]);
  }

  get usernameControl() {
    return this.addUserForm.controls['username'] as FormControl<string>;
  }

  get passwordControl() {
    return this.addUserForm.controls['password'] as FormControl<string>;
  }

  get rolesControl() {
    return this.addUserForm.controls['roles'] as FormControl<Role>;
  }

  get emailAddressControl() {
    return this.addUserForm.get(['profile', 'email_address']) as FormControl<string>
  }

  get phoneNumberControl() {
    return this.addUserForm.get(['profile', 'phone_number']) as FormControl<string>;
  }

  get addressLine1Control() {
    return this.addUserForm.get(['profile', 'address', 'address_line_1']) as FormControl<string>;
  }

  get addressLine2Control() {
    return this.addUserForm.get(['profile', 'address', 'address_line_2']) as FormControl<string>;
  }

  get stateControl() {
    return this.addUserForm.get(['profile', 'address', 'state']) as FormControl<State>;
  }

  get cityControl() {
    return this.addUserForm.get(['profile', 'address', 'city']) as FormControl<City>;
  }

  get zipcodeControl() {
    return this.addUserForm.get(['profile', 'address', 'zipcode']) as FormControl<string>;
  }

  get countryControl() {
    return this.addUserForm.get(['profile', 'address', 'country']) as FormControl<{id:number,name:string}>;
  }

  createUser() {

    this.addUserForm.markAllAsTouched();

    if (this.addUserForm.valid) {

      const {username, password, profile} = this.addUserForm.getRawValue();


      // this.userService.createNewAccount({
      //   username: username,
      //   roles: [this.rolesControl.getRawValue()],
      //   profile: {
      //     address: {
      //       address_line_1: profile.address.address_line_1,
      //       address_line_2: profile.address.address_line_2,
      //       city: this.cityControl.getRawValue().name,
      //       state: this.stateControl.getRawValue().name,
      //       zipcode: profile.address.zipcode,
      //       country: this.countryControl.getRawValue().name
      //     },
      //     email_address: username,
      //     phone_number: profile.phone_number
      //
      //   },
      //   password: password,
      //   disabled: false,
      //   email_verified: false
      // }, false).subscribe({
      //   next: res => {
      //     this.userService.refresh();
      //     this.alertService.showAlert('Created User Successfully', 'User is created successfully', Status.SUCCESS);
      //     this.dialogSubscriptionService.dialog$.unsubscribe();
      //
      //   },
      //   error: err => this.alertService.showAlert('Error', 'Something went wrong', Status.ERROR)
      // })
    }
  }


}
