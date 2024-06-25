import { Component } from '@angular/core';
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {FormService} from "../../../../core/form/form.service";

@Component({
  selector: 'app-datetime-form',
  standalone: true,
    imports: [
        ButtonComponent,
        FormsModule,
        CommonModule,
        ReactiveFormsModule
    ],
  templateUrl: './datetime-form.component.html',
  styleUrl: './datetime-form.component.scss'
})
export class DatetimeFormComponent {
  datetimeProperties: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.datetimeProperties = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      isRequired: [false],
      requiredErrorText: ['']
    })
  }

  get nameControl() {
    return this.datetimeProperties.get('name') as FormControl;
  }

  get titleControl() {
    return this.datetimeProperties.get('title') as FormControl;
  }

  get isRequiredControl() {
    return this.datetimeProperties.get('isRequired') as FormControl;
  }

  get requiredErrorTextControl() {
    return this.datetimeProperties.get('requiredErrorText') as FormControl;
  }

  addControl() {
    this.datetimeProperties.markAllAsTouched();
    if(this.datetimeProperties.valid){
      this.formService.createDatetime(this.datetimeProperties.getRawValue());
    }
  }
}
