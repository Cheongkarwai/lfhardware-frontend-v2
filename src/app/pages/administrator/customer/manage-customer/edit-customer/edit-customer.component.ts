import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Customer} from "../../../../../core/customer/customer.interface";
import {CustomerService} from "../../../../../core/customer/customer.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ViewCustomerComponent} from "../view-customer/view-customer.component";
import {map, Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {TextInputComponent} from "../../../../../components/text-input/text-input.component";
import {DropdownComponent, DropdownItem} from "../../../../../components/dropdown/dropdown.component";
import {StateService} from "../../../../../core/state/state.service";
import {CityService} from "../../../../../core/city/city.service";
import {ZipcodeInputComponent} from "../../../../../components/zipcode-input/zipcode-input.component";
import {State} from "../../../../../core/state/state.interface";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {ToastService} from "../../../../../core/dialog/toast.service";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, DropdownComponent, ZipcodeInputComponent, ButtonComponent],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.scss'
})
export class EditCustomerComponent implements OnInit {

  customer$!: Observable<Customer>;
  editCustomerForm!: FormGroup;
  stateItems$!: Observable<DropdownItem[]>;
  cityItems$!: Observable<DropdownItem[]>;

  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              @Inject(MAT_DIALOG_DATA) public data: { customerId: string },
              private dialogRef: MatDialogRef<ViewCustomerComponent>,
              private stateService: StateService,
              private cityService: CityService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    initFlowbite();
    this.customer$ = this.customerService.findById(this.data.customerId)
      .pipe(map(customer => {
        this.editCustomerForm.patchValue(customer);
        return customer;
      }));
    this.editCustomerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email_address: ['', Validators.required],
      address: this.fb.group({
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required],
        country: [''],
        line_1: ['', Validators.required],
        line_2: ['']
      }),
      email_verified: [false],
      enabled: [false, Validators.required]
    });
    this.stateItems$ = this.stateService.findAll().pipe(map(states => {
      return states.map(state => {
        return {
          title: state.name,
          value: state.name
        };
      });
    }));
    this.cityItems$ = this.cityService.findAll().pipe(map(cities => {
      return cities.map(city => {
        return {
          title: city.name,
          value: city.name
        };
      });
    }));
  }

  get firstNameControl() {
    return this.editCustomerForm.get('first_name') as FormControl;
  }

  get lastNameControl() {
    return this.editCustomerForm.get('last_name') as FormControl;
  }

  get emailAddressControl() {
    return this.editCustomerForm.get('email_address') as FormControl;
  }

  get emailVerifiedControl() {
    return this.editCustomerForm.get('email_verified') as FormControl;
  }

  get accountEnabledControl(){
    return this.editCustomerForm.get('enabled') as FormControl;
  }

  get phoneNumberControl() {
    return this.editCustomerForm.get('phone_number') as FormControl;
  }

  get cityControl() {
    return this.editCustomerForm.get('address')?.get('city') as FormControl;
  }

  get stateControl() {
    return this.editCustomerForm.get('address')?.get('state') as FormControl;
  }

  get countryControl() {
    return this.editCustomerForm.get('address')?.get('country') as FormControl;
  }

  get line1Control() {
    return this.editCustomerForm.get('address')?.get('line_1') as FormControl;
  }

  get line2Control() {
    return this.editCustomerForm.get('address')?.get('line_2') as FormControl;
  }

  get zipcodeControl() {
    return this.editCustomerForm.get('address')?.get('zipcode') as FormControl;
  }


  update() {
    console.log(this.editCustomerForm)
    this.editCustomerForm.markAllAsTouched();

    if (this.editCustomerForm.valid) {
      this.customerService.update(this.data.customerId, this.editCustomerForm.getRawValue())
        .subscribe({
          next: res => {
            this.dialogRef.close();
            this.dialogRef.afterClosed()
              .subscribe({
                next: res => this.toastService.open('Updated customer details', 'success')
              });
          },
          error: err => {

          }
        });
    }
  }

  compareState(o1: State, o2: State) {
    return o1.id === o2.id;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
