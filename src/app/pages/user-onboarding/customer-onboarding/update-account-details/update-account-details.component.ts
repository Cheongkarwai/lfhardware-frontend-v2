import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PhoneInputComponent} from "../../../../components/phone-input/phone-input.component";
import {ZipcodeInputComponent} from "../../../../components/zipcode-input/zipcode-input.component";
import {initFlowbite} from "flowbite";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextInputComponent} from "../../../../components/text-input/text-input.component";
import {DropdownComponent, DropdownItem} from "../../../../components/dropdown/dropdown.component";
import {StateService} from "../../../../core/state/state.service";
import {CityService} from "../../../../core/city/city.service";
import {map, Observable, shareReplay, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {CustomerOnboardService} from "../../../../core/customer/customer-onboard.service";
import {ToastService} from "../../../../core/dialog/toast.service";
import {CustomerService} from "../../../../core/customer/customer.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-update-account-details',
  standalone: true,
  imports: [
    CommonModule,
    PhoneInputComponent,
    ZipcodeInputComponent,
    TextInputComponent,
    ReactiveFormsModule,
    DropdownComponent
  ],
  templateUrl: './update-account-details.component.html',
  styleUrl: './update-account-details.component.scss'
})
export class UpdateAccountDetailsComponent implements OnInit{

  @Output()
  step: EventEmitter<string> = new EventEmitter<string>();

  basicInformationForm!: FormGroup;
  termAndCondition: FormControl<boolean | null> = new FormControl<boolean>(false, );

  stateItems$!: Observable<DropdownItem[]>;
  cityItems$!: Observable<DropdownItem[]>;

  @ViewChild(PhoneInputComponent) phoneInputComponent!: PhoneInputComponent;

  constructor(private fb: FormBuilder,
              private stateService: StateService,
              private cityService: CityService,
              private customerFormService: CustomerOnboardService,
              private toastService: ToastService,
              private customerService: CustomerService,
              private router: Router) {
  }

  ngOnInit() {
    initFlowbite();
    this.basicInformationForm = this.fb.group({
      phone_number: ['', Validators.required],
      phone_number_prefix: ['', Validators.required],
      address : this.fb.group({
        line_1: ['', Validators.required],
        line_2: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required]
      })
    });
    this.findStates();
    this.findCities();
  }

  findCities(){
    this.cityItems$ = this.cityService.findAll().pipe(map(cities => {
        return cities.map(city => {
          return {
            title: city.name,
            value: city.name
          };
        });
    }));
  }
  findStates(){
    this.stateItems$ = this.stateService.findAll()
      .pipe(map(states=>{
        return states.map(state=> {
          return {
            title: state.name,
            value: state.name
          } as DropdownItem;
        })
      }))
  }

  changeStep(step:string){
    this.step.emit(step);
    this.router.navigate(['user-onboarding','role-confirmation'])
  }

  get phoneNumberControl(){
    return this.basicInformationForm.get('phone_number') as FormControl;
  }

  get phoneNumberPrefixControl(){
    return this.basicInformationForm.get('phone_number_prefix') as FormControl;
  }

  get addressLine1Control(){
    return this.basicInformationForm.get('address')?.get('line_1') as FormControl;
  }

  get addressLine2Control(){
    return this.basicInformationForm.get('address')?.get('line_2') as FormControl;
  }

  get addressCityControl(){
    return this.basicInformationForm.get('address')?.get('city') as FormControl;
  }

  get addressStateControl(){
    return this.basicInformationForm.get('address')?.get('state') as FormControl;
  }

  get addressZipcodeControl(){
    return this.basicInformationForm.get('address')?.get('zipcode') as FormControl;
  }

  submitBasicInformation(){
    this.basicInformationForm.markAllAsTouched();

    if(this.basicInformationForm.valid){
      //If term and condition is accepted
      if(this.termAndCondition.getRawValue()){
        this.customerService.save(this.basicInformationForm.getRawValue())
          .subscribe({
            next:res=> {
              this.customerService.refresh();
              this.toastService.open('Account information is saved', 'success');
              this.customerFormService.saveBasicInformation(this.basicInformationForm.getRawValue());
              this.step.emit('Account Confirmation');
            },
            error:err=> this.toastService.open('Something went wrong when saving account information', 'error')
          });
      }else{
        this.toastService.open('Please agree to the term & condition before proceed','error');
      }
    }else{
      this.toastService.open('Please fill in all the required fields before proceed','error');
    }
  }

}
