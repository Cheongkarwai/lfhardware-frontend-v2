import { Component } from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {DynamicFormComponent} from "../../../../../components/dynamic-form/dynamic-form.component";
import {RouterOutlet} from "@angular/router";
import {
  TuiDataListWrapperModule,
  TuiInputCopyModule,
  TuiInputModule,
  TuiRatingModule,
  TuiSelectModule
} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [
    AsyncPipe,
    DynamicFormComponent,
    NgIf,
    RouterOutlet,
    TuiDataListWrapperModule,
    TuiInputCopyModule,
    TuiRatingModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiInputModule
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {

  contactDetailsForm:FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactDetailsForm = this.fb.group({
      first_name: ['',Validators.required],
      last_name:['', Validators.required],
      email_address: ['', Validators.required],
      phone_number: ['', Validators.required],
      address_line_1: ['' ,Validators.required],
      address_line_2: ['', Validators.required],
      state: ['' ,Validators.required],
      city:['', Validators.required],
      postcode: ['', Validators.required],
    });
  }
}
