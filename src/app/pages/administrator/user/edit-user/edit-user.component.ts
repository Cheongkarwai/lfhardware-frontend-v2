import {Component, Inject, OnDestroy} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Validator} from "../../../../core/validator";
import {UserService} from "../../../../core/user/user.service";
import {forkJoin, map, Observable, combineLatest, switchMap, of, Subject, takeUntil, pairwise} from "rxjs";
import {City} from "../../../../core/city/city.interface";
import {State} from "../../../../core/state/state.interface";
import {Role} from "../../../../core/user/role.interface";
import {CityService} from "../../../../core/city/city.service";
import {StateService} from "../../../../core/state/state.service";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {TuiDialogContext} from "@taiga-ui/core";
import {UserAccount} from "../../../../core/user/user-account.interface";

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnDestroy{

  showLoading: boolean = false;
  editUserForm: FormGroup;
  formObservables$: Observable<[Role[], City[], State[]]>;
  user$: Observable<UserAccount>;

  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private userService: UserService, private cityService: CityService,
              private stateService: StateService, @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>) {
    this.editUserForm = this.fb.group({
      username: ['', [Validators.required, Validator.noWhitespaceValidator]],
      roles: ['', Validators.required],
      profile: this.fb.group({
        email_address: [''],
        phone_number: ['', [Validators.required, Validator.noWhitespaceValidator]],
        address: this.fb.group({
          address_line_1: [''],
          address_line_2: [''],
          state: ['', Validators.required],
          city: ['', Validators.required],
          zipcode: ['', [Validators.required, Validator.noWhitespaceValidator]]
        })
      })
    });

    this.usernameControl.valueChanges.pipe(pairwise(),takeUntil(this.destroy$)).subscribe(([prev,res])=>{
      this.usernameControl.addAsyncValidators(Validator.createUsernameValidator(this.userService));
    })

    const username = this.context.data as any;
    this.formObservables$ = forkJoin([this.userService.findAllCurrentUserRoles(), this.cityService.findAll(), this.stateService.findAll()]);
    this.user$ = this.userService.findUserAccountByUsername(username).pipe(map(user=>{
      this.editUserForm.patchValue(user);
      return user;
    }));
  }

  get usernameControl() {
    return this.editUserForm.controls['username'] as FormControl<string>;
  }

  get rolesControl() {
    return this.editUserForm.controls['roles'] as FormControl<Role>;
  }

  get emailAddressControl() {
    return this.editUserForm.get(['profile', 'email_address']) as FormControl<string>
  }

  get phoneNumberControl() {
    return this.editUserForm.get(['profile', 'phone_number']) as FormControl<string>;
  }

  get addressLine1Control() {
    return this.editUserForm.get(['profile', 'address', 'address_line_1']) as FormControl<string>;
  }

  get addressLine2Control() {
    return this.editUserForm.get(['profile', 'address', 'address_line_2']) as FormControl<string>;
  }

  get stateControl() {
    return this.editUserForm.get(['profile', 'address', 'state']) as FormControl<State>;
  }

  get cityControl() {
    return this.editUserForm.get(['profile', 'address', 'city']) as FormControl<City>;
  }

  get zipcodeControl() {
    return this.editUserForm.get(['profile', 'address', 'zipcode']) as FormControl<string>;
  }

  editUser() {

    this.editUserForm.markAllAsTouched();

    if(this.editUserForm.valid){

    }
  }

  compareRole(a:Role,b: Role[]){
    for(const role of b){
      return a.id === role.id;
    }
    return false;
  }

  compareState(a:State, b:string){
    return a.name === b;
  }

  compareCity(a:City, b:string){
    return a.name === b;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
