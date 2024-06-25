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
    ReactiveFormsModule,
    CommonModule,
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
      contact_info: [],

      contact_number:[],
      email_address:[],
      fax_no:[],

    });
  }
}
