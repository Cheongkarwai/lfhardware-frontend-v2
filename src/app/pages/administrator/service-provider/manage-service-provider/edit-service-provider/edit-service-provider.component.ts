import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {DropdownComponent, DropdownItem} from "../../../../../components/dropdown/dropdown.component";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextInputComponent} from "../../../../../components/text-input/text-input.component";
import {ZipcodeInputComponent} from "../../../../../components/zipcode-input/zipcode-input.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {map, Observable, shareReplay, switchMap} from "rxjs";
import {ServiceProviderDetails} from "../../../../../core/service-provider/service-provider-details";
import {ProviderService} from "../../../../../core/service-provider/service-provider.service";
import {TextareaComponent} from "../../../../../components/textarea/textarea.component";
import {StateService} from "../../../../../core/state/state.service";
import {CityService} from "../../../../../core/city/city.service";
import {DropdownCheckboxComponent} from "../../../../../components/dropdown-checkbox/dropdown-checkbox.component";
import {ProviderBusinessService} from "../../../../../core/service-provider/provider-business.service";
import {ToastService} from "../../../../../core/dialog/toast.service";
import {ConfirmationDialogComponent} from "../../../../../components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-edit-service-provider',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    DropdownComponent,
    ReactiveFormsModule,
    TextInputComponent,
    ZipcodeInputComponent,
    TextareaComponent,
    DropdownCheckboxComponent
  ],
  templateUrl: './edit-service-provider.component.html',
  styleUrl: './edit-service-provider.component.scss'
})
export class EditServiceProviderComponent implements OnInit {

  serviceProviderForm!: FormGroup;
  serviceProviderDetails$!: Observable<ServiceProviderDetails>;
  stateItems$!: Observable<DropdownItem[]>;
  cityItems$!: Observable<DropdownItem[]>;
  serviceItems$!: Observable<DropdownItem[]>;
  // countries$ = new Observable<string[]>();
  // services$ = new Observable<{ title: string, value: any }[]>();


  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { serviceProviderId: string },
              private dialogRef: MatDialogRef<EditServiceProviderComponent>,
              private providerService: ProviderService,
              private stateService: StateService,
              private cityService: CityService,
              private businessService: ProviderBusinessService,
              private toastService: ToastService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.serviceProviderDetails$ = this.providerService.findById(this.data.serviceProviderId)
      .pipe(map(serviceProvider => {
        this.serviceProviderForm.patchValue(serviceProvider);
        return serviceProvider;
      }), shareReplay(1));

    this.serviceProviderForm = this.fb.group({
      name: ['', Validators.required],
      is_verified: [false, Validators.required],
      contact_info: this.fb.group({
        email_address: ['', Validators.required],
        phone_number: ['', Validators.required],
        whatsapp: ['', Validators.required],
        fax_no: ['']
      }),
      address: this.fb.group({
        line_1: ['', Validators.required],
        line_2: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required]
      }),
      overview: [''],
      services: this.fb.array([]),
      coverage: this.fb.group({
        states: this.fb.array([]),
        cities: this.fb.array([])
      })
      // location: ['', Validators.required],
      // address: this.fb.group({
      //   line_1: ['', Validators.required],
      //   line_2: ['', Validators.required],
      //   city: ['', Validators.required],
      //   state: ['', Validators.required],
      //   zipcode: ['', Validators.required]
      // }),
      // website: ['', Validators.required]
    });

    this.findStates();
    this.findCities();
    this.findServices();
  }

  findStates() {
    this.stateItems$ = this.serviceProviderDetails$.pipe(switchMap(serviceProviderDetails => {
      return this.stateService.findAll().pipe(map(states => {
        return states.map(state => {
          this.stateCoverageFormArray.push(this.fb.group({
            value: state,
            selected: serviceProviderDetails.state_coverages.includes(state.name)
          }))
          return {
            title: state.name,
            value: state.name
          };
        });
      }));
    }), shareReplay(1))
  }

  findCities() {
    this.cityItems$ = this.serviceProviderDetails$.pipe(switchMap(serviceProviderDetails => {
      return this.cityService.findAll().pipe(map(cities => {
        return cities.map(city => {
          this.cityCoverageFormArray.push(this.fb.group({
            value: city,
            selected: serviceProviderDetails.city_coverages.includes(city.name)
          }))
          return {
            title: city.name,
            value: city.name
          };
        });
      }));
    }), shareReplay(1));
  }

  findServices() {
    this.serviceItems$ = this.serviceProviderDetails$.pipe(switchMap(serviceProviderDetails => {
      return this.businessService.findAllServices().pipe(map(serviceCategories => {
        const services: DropdownItem[] = [];
        serviceCategories.forEach(serviceCategories => {
          services.push(...serviceCategories.services.map(service => {
            this.serviceFormArray.push(this.fb.group({
              value: service,
              selected: serviceProviderDetails.services.map(service => service.id).includes(service.id)
            }));
            return {
              title: service.name,
              value: service.id
            };
          }))
        });
        return services;
      }), shareReplay(1));
    }));
  }

  get nameControl() {
    return this.serviceProviderForm.get('name') as FormControl<string>;
  }

  get contactInfoGroup() {
    return this.serviceProviderForm.get('contact_info') as FormGroup;
  }

  get phoneNumberControl() {
    return this.contactInfoGroup.get('phone_number') as FormControl<string>;
  }

  get emailControl() {
    return this.contactInfoGroup.get('email_address') as FormControl<string>;
  }

  get whatsappControl() {
    return this.contactInfoGroup.get('whatsapp') as FormControl<string>;
  }

  get addressGroup() {
    return this.serviceProviderForm.get('address') as FormGroup;
  }

  get line1Control() {
    return this.addressGroup.get('line_1') as FormControl;
  }

  get line2Control() {
    return this.addressGroup.get('line_2') as FormControl;
  }

  get zipcodeControl() {
    return this.addressGroup.get('zipcode') as FormControl;
  }

  get stateControl() {
    return this.addressGroup.get('state') as FormControl;
  }

  get cityControl() {
    return this.addressGroup.get('city') as FormControl;
  }

  get overviewControl(){
    return this.serviceProviderForm.get('overview') as FormControl;
  }
  get serviceDetailsGroup() {
    return this.serviceProviderForm.get('service_details') as FormGroup;
  }

  get businessAddressGroup() {
    return this.serviceProviderForm.get('address') as FormGroup;
  }

  get verifiedControl() {
    return this.serviceProviderForm.get('is_verified') as FormControl<boolean>;
  }

  get businessNameControl() {
    return this.serviceProviderForm.get('name') as FormControl<string>;
  }

  get businessEmailControl() {
    return this.serviceProviderForm.get('email_address') as FormControl;
  }

  get businessLocationControl() {
    return this.serviceProviderForm.get('location') as FormControl;
  }

  get businessFaxNoControl() {
    return this.serviceProviderForm.get('fax_no') as FormControl;
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
    return this.serviceProviderForm.get('website') as FormControl;
  }


  get stateCoverageFormArray() {
    return this.serviceProviderForm.get('coverage')?.get('states') as FormArray;
  }

  get cityCoverageFormArray() {
    return this.serviceProviderForm.get('coverage')?.get('cities') as FormArray;
  }

  get serviceFormArray() {
    return this.serviceProviderForm.get('services') as FormArray;
  }

  closeModal() {
    this.dialogRef.close();
  }

  update() {
    this.serviceProviderForm.markAllAsTouched();

    if (this.serviceProviderForm.valid) {

      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Update Service Provider Details',
          text: 'You are about to update service provider details',
          icon: 'warning'
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          const formVal = this.serviceProviderForm.getRawValue();
          formVal.services = this.serviceFormArray.getRawValue()
            .filter(service=> service.selected)
            .map(service=> service.value);
          formVal.coverage.states = this.stateCoverageFormArray.getRawValue()
            .filter(state=> state.selected)
            .map(state=> state.value)
          this.providerService.updateById(this.data.serviceProviderId, formVal)
            .subscribe({
              next: res => {
                this.dialogRef.close();
                this.dialogRef.afterClosed().subscribe({
                  next:res=>   this.toastService.open('Service provider details is updated', 'success')
                });
              },
              error: err => {
                this.toastService.open('Something went wrong when updating service provider details', 'error');
              }
            });
        }
      });
    }
  }
}
