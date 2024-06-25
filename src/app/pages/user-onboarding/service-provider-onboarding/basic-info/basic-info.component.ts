import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {map, Observable} from "rxjs";
import {ServiceProviderSignupService} from "../../../../core/service-provider/service-provider-signup.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../../core/service/alert.service";
import {CityService} from "../../../../core/city/city.service";
import {State} from "../../../../core/state/state.interface";
import {StateService} from "../../../../core/state/state.service";
import {CountryService} from "../../../../core/country/country.service";
import {ProviderBusinessService} from "../../../../core/service-provider/provider-business.service";
import {Service} from "../../../../core/service-provider/service.interface";
import {UserService} from "../../../../core/user/user.service";
import {PhoneInputComponent} from "../../../../components/phone-input/phone-input.component";
import {DropdownCheckboxComponent} from "../../../../components/dropdown-checkbox/dropdown-checkbox.component";
import {initFlowbite} from "flowbite";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent, Status} from "../../../../components/alert-dialog/alert-dialog.component";
import {TextInputComponent} from "../../../../components/text-input/text-input.component";
import {DropdownComponent, DropdownItem} from "../../../../components/dropdown/dropdown.component";
import {ProviderService} from "../../../../core/service-provider/service-provider.service";


@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    PhoneInputComponent,
    DropdownCheckboxComponent,
    TextInputComponent,
    DropdownComponent
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss'
})
export class BasicInfoComponent implements OnInit {

  @Output()
  onChangeStep: EventEmitter<string> = new EventEmitter<string>();


  basicInfoForm!: FormGroup;

  cities$ = new Observable<string[]>();
  states$ = new Observable<{ title: string, value: any }[]>();
  countries$ = new Observable<string[]>();
  services$ = new Observable<{ title: string, value: any }[]>();

  services: Service[] = [];

  locations: DropdownItem[] = [
    {title: 'Malaysia', value: 'MY'}
  ];

  isSubmitting: boolean = false;


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private serviceProviderSignupFormService: ServiceProviderSignupService,
              private fb: FormBuilder,
              private alertService: AlertService,
              private cityService: CityService,
              private stateService: StateService,
              private countryService: CountryService,
              private providerBusinessService: ProviderBusinessService,
              private userService: UserService,
              private matDialog: MatDialog,
              private providerService: ProviderService) {

  }

  ngOnInit() {
    initFlowbite();

    this.basicInfoForm = this.fb.group({
      business_details: this.fb.group({
        name: ['', Validators.required],
        email_address: ['', Validators.required],
        phone_number: ['', Validators.required],
        phone_number_prefix: [''],
        fax_no: ['', [Validators.required]],
        fax_no_prefix: [''],
        location: ['', Validators.required],
        address: this.fb.group({
          line_1: ['', Validators.required],
          line_2: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipcode: ['', Validators.required]
        }),
        website: ['', Validators.required]
      }),
      service_details: this.fb.group({
        services: this.fb.array([]),
        coverage: this.fb.group({
          states: this.fb.array([]),
        }),
      }),
    });

    this.cities$ = this.cityService.findAll().pipe(map(cities => cities.map(city => city.name)));
    this.states$ = this.stateService.findAll().pipe(map(states => {
      return states.map(state => {
        this.addStateControl(state);
        return {
          title: state.name,
          value: state.name
        }
      });
    }));
    this.countries$ = this.countryService.findAll().pipe(map(countries => countries.map(country => country.name)));
    this.services$ = this.providerBusinessService.findAllServices().pipe(map(serviceCategories => {
      const services: { title: string, value: any }[] = [];
      serviceCategories.forEach(serviceCategories => {
        services.push(...serviceCategories.services.map(service => {
          this.addServiceControl(service);
          return {
            title: service.name,
            value: service.id
          };
        }))
      });

      return services;
    }));

    // this.services$ = this.providerBusinessService.findAllServices().pipe(map(serviceCategories=>{
    //   const services:Service[] = [];
    //   serviceCategories.forEach(serviceCategories=> services.push(... serviceCategories.services))
    //   return services;
    // }));
    // // this.serviceProviderSignupFormService.basicInfoFormData.subscribe(res=>{
    // //   if(res){
    // //     console.log(res);
    // //     this.basicInfoForm.patchValue(res);
    // //   }
    // // })
    // this.serviceProviderSignupFormService.setBasicInfoFormValid(true);
    // this.basicInfoForm = this.fb.group({
    //   business_details:this.fb.group({
    //     name:['',[Validators.required]],
    //     email_address:['',[Validators.required,UserValidator.createUsernameValidator(this.userService)]],
    //     description:[''],
    //     address:['',[Validators.required]],
    //   }),
    //   service_details:this.fb.group({
    //     type_of_services:[[],[Validators.required]],
    //     contact_info: this.fb.group({
    //       email_address:['',[Validators.required]],
    //       phone_number:['',[Validators.required]],
    //       whatsapp:['',[Validators.required]]
    //     }),
    //     coverage: this.fb.group({
    //       countries: [[],[Validators.required]],
    //       states:[[],[Validators.required]],
    //       cities: [[],[Validators.required]]
    //     }),
    //   }),
    // });

    // this.retainOldFormData();
  }

  //
  // retainOldFormData() {
  //   if (this.serviceProviderSignupFormService.basicInfoFormData.value) {
  //     this.basicInfoForm.patchValue(this.serviceProviderSignupFormService.basicInfoFormData.value);
  //   }
  // }
  //
  // setActiveIndex(index: number) {
  //   this.serviceProviderSignupFormService.setCurrentIndex(index);
  // }

  get businessPhoneNumberPrefixControl(){
    return this.businessDetailsGroup.get('phone_number_prefix') as FormControl;
  }

  get businessFaxNoPrefixControl(){
    return this.businessDetailsGroup.get('fax_no_prefix') as FormControl;
  }
  get businessPhoneNumberControl() {
    return this.businessDetailsGroup.get('phone_number') as FormControl;
  }

  get businessDetailsGroup() {
    return this.basicInfoForm.get('business_details') as FormGroup;
  }

  get serviceDetailsGroup() {
    return this.basicInfoForm.get('service_details') as FormGroup;
  }

  get businessAddressGroup() {
    return this.businessDetailsGroup.get('address') as FormGroup;
  }

  get businessNameControl() {
    return this.businessDetailsGroup.get('name') as FormControl;
  }

  get businessEmailControl() {
    return this.businessDetailsGroup.get('email_address') as FormControl;
  }

  get businessLocationControl() {
    return this.businessDetailsGroup.get('location') as FormControl;
  }

  get businessFaxNoControl() {
    return this.businessDetailsGroup.get('fax_no') as FormControl;
  }

  get businessAddressLine1Control() {
    return this.businessAddressGroup.get('line_1') as FormControl;
  }

  get businessAddressLine2Control() {
    return this.businessAddressGroup.get('line_2') as FormControl;
  }

  get businessCityControl() {
    return this.businessAddressGroup.get('city') as FormControl;
  }

  get businessStateControl() {
    return this.businessAddressGroup.get('state') as FormControl;
  }

  get businessZipcodeControl() {
    return this.businessAddressGroup.get('zipcode') as FormControl;
  }

  get businessWebsiteControl() {
    return this.businessDetailsGroup.get('website') as FormControl;
  }

  get serviceFormArray() {
    return this.serviceDetailsGroup.get('services') as FormArray;
  }

  get stateCoverageFormArray() {
    return this.serviceDetailsGroup.get('coverage')?.get('states') as FormArray;
  }

  addServiceControl(service: Service) {
    this.serviceFormArray.push(this.fb.group({
      value: [service],
      selected: false,
    }))
  }

  addStateControl(state: State) {
    this.stateCoverageFormArray.push(this.fb.group({
      value: [state],
      selected: false,
    }))
  }

  nextStep() {
    this.basicInfoForm.markAllAsTouched();
    if (this.basicInfoForm.valid) {
      this.isSubmitting = true;
      const input = this.basicInfoForm.getRawValue();
      let {service_details} = this.basicInfoForm.getRawValue();
      const services = service_details.services as { value: Service, selected: boolean }[];
      const stateCoverage = service_details.coverage.states as { value: Service, selected: boolean }[];
      service_details.services = services.filter(service => service.selected).map(service => service.value);
      service_details.coverage.states = stateCoverage.filter(state => state.selected).map(state => state.value);
      input.service_details = service_details;
      this.serviceProviderSignupFormService.setBasicInfoFormData(input);
      this.providerService.save(this.serviceProviderSignupFormService.getValue())
        .subscribe({
          next: res => {
            setTimeout(() => {
              this.isSubmitting = false;
              this.serviceProviderSignupFormService.nextStep();
            }, 2000);
          },
          error: err => {
            this.isSubmitting = false;
          }
        });
      //this.serviceProviderSignupFormService.nextStep();
    } else {
      this.matDialog.open(AlertDialogComponent, {
        data: {
          title: 'Incomplete form',
          text: 'Please fill in all the required fields before proceed to next step',
          status: Status.ERROR
        }
      })
    }


    //this.onChangeStep.emit(step);
  }

  back() {
    this.router.navigate(['user-onboarding', 'role-confirmation']);
  }
}
