import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiInputModule, TuiInputPasswordModule} from "@taiga-ui/kit";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-add-service-provider',
  standalone: true,
  imports: [
    RouterLink,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
    ReactiveFormsModule,
    CommonModule,
    TuiInputPasswordModule
  ],
  templateUrl: './add-service-provider.component.html',
  styleUrl: './add-service-provider.component.scss'
})
export class AddServiceProviderComponent implements  OnInit{

  serviceProviderForm!:FormGroup;
  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.serviceProviderForm = this.fb.group({
      username:['',[Validators.required]],
      password:[],
      contact_number:[],
      email_address:[],
      fax_no:[],

    });
  }
}
