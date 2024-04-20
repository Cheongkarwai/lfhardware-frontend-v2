import {Component, OnInit} from '@angular/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputTagModule, TuiMultiSelectModule,
  TuiTextareaModule
} from "@taiga-ui/kit";
import {TuiErrorModule, TuiLabelModule, TuiTextfieldControllerModule, TuiTooltipModule} from "@taiga-ui/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {delay, map, Observable, of, startWith, Subject, switchMap} from "rxjs";
import {ServiceProviderSignupService} from "../../../core/service-provider/service-provider-signup.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AlertService} from "../../../core/service/alert.service";
import {CityService} from "../../../core/city/city.service";
import {City} from "../../../core/city/city.interface";
import {State} from "../../../core/state/state.interface";
import {StateService} from "../../../core/state/state.service";
import {
  EMPTY_ARRAY,
  TuiBooleanHandler,
  TuiContextWithImplicit,
  TuiLetModule,
  TuiStringHandler,
  TuiValidationError
} from "@taiga-ui/cdk";
import {CountryService} from "../../../core/country/country.service";
import {ProviderBusinessService} from "../../../core/service-provider/provider-business.service";
import {Service} from "../../../core/service-provider/service.interface";
import {UserService} from "../../../core/user/user.service";
import {Validator} from "../../../core/validator";


@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLabelModule,
    TuiTooltipModule,
    TuiTextareaModule,
    TuiInputTagModule,
    FormsModule,
    TuiDataListWrapperModule,
    RouterLink,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiMultiSelectModule,
    TuiLetModule
  ],
  providers:[
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Required',
        email: 'Enter a valid email',
        maxlength: ({requiredLength}: { requiredLength: string }) =>
          `Maximum length — ${requiredLength}`,
        usernameExists: 'Username is taken',
        phoneNumberExists: 'Phone number is taken'
      },
    }
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss'
})
export class BasicInfoComponent implements OnInit{
  routes:any[] = [];
  currentIndex = 0;

  basicInfoForm!:FormGroup;

  cities$ = new Observable<string[]>();
  states$ = new Observable<string[]>();
  countries$ = new Observable<string[]>();
  services$ = new Observable<Service[]>();

  serviceStringify: TuiStringHandler<Service | TuiContextWithImplicit<Service>> = item =>
    'name' in item ? item.name : item.$implicit.name;
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private serviceProviderSignupFormService:ServiceProviderSignupService, private fb:FormBuilder,
              private alertService:AlertService, private cityService:CityService, private stateService:StateService, private countryService:CountryService,
              private providerBusinessService:ProviderBusinessService, private userService: UserService) {
    this.currentIndex = activatedRoute.snapshot.data?.['index'];
    this.routes = this.router.config.filter(route=>route.path === 'service-provider-signup')
      .flatMap(parentRoute=>parentRoute.children).filter(route=>route?.path !== '');
    this.setActiveIndex(this.currentIndex);
    this.cities$ = this.cityService.findAll().pipe(map(cities=>cities.map(city=>city.name)));
    this.states$ = this.stateService.findAll().pipe(map(states=>states.map(state=>state.name)));
    this.countries$ = this.countryService.findAll().pipe(map(countries=>countries.map(country=>country.name)));
    this.services$ = this.providerBusinessService.findAllServices().pipe(map(serviceCategories=>{
      const services:Service[] = [];
      serviceCategories.forEach(serviceCategories=> services.push(... serviceCategories.services))
      return services;
    }));
    // this.serviceProviderSignupFormService.basicInfoFormData.subscribe(res=>{
    //   if(res){
    //     console.log(res);
    //     this.basicInfoForm.patchValue(res);
    //   }
    // })
    this.serviceProviderSignupFormService.setBasicInfoFormValid(true);
    this.basicInfoForm = this.fb.group({
      business_details:this.fb.group({
        name:['',[Validators.required]],
        email_address:['',[Validators.required],[Validator.createUsernameValidator(this.userService)]],
        description:[''],
        address:['',[Validators.required]],
      }),
      service_details:this.fb.group({
        type_of_services:[[],[Validators.required]],
        contact_info: this.fb.group({
          email_address:['',[Validators.required]],
          phone_number:['',[Validators.required],[Validator.createPhoneNumberValidator(this.userService)]],
          whatsapp:['',[Validators.required]]
        }),
        coverage: this.fb.group({
          countries: [[],[Validators.required]],
          states:[[],[Validators.required]],
          cities: [[],[Validators.required]]
        }),
      }),
    });

  }

  ngOnInit() {
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

    this.retainOldFormData();
  }

  retainOldFormData(){
    if(this.serviceProviderSignupFormService.basicInfoFormData.value){
      this.basicInfoForm.patchValue(this.serviceProviderSignupFormService.basicInfoFormData.value);
    }
  }

  setActiveIndex(index:number){
    this.serviceProviderSignupFormService.setCurrentIndex(index);
  }

  submitBasicInfo() {
    this.basicInfoForm.markAllAsTouched();
    if(this.basicInfoForm.invalid){
      this.alertService.showError(`Please fill in the required fields`);
    }else{
      this.router.navigate([`../${this.routes[this.currentIndex+1].path}`],{relativeTo:this.activatedRoute})
        .then(res=>{
          this.serviceProviderSignupFormService.setBasicInfoFormData(this.basicInfoForm.getRawValue());
          this.setActiveIndex(this.currentIndex + 1);
          this.serviceProviderSignupFormService.setBasicInfoFormValid(this.basicInfoForm.valid);
        });

    }
  }
}
