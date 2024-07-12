import {Component} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {FormService} from "../../../../../core/form/form.service";

@Component({
  selector: 'app-date-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './date-form.component.html',
  styleUrl: './date-form.component.scss'
})
export class DateFormComponent {

  dateProperties: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.dateProperties = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      isRequired: [false],
      requiredErrorText: ['']
    })
  }

  get nameControl() {
    return this.dateProperties.get('name') as FormControl;
  }

  get titleControl() {
    return this.dateProperties.get('title') as FormControl;
  }

  get isRequiredControl() {
    return this.dateProperties.get('isRequired') as FormControl;
  }

  get requiredErrorTextControl() {
    return this.dateProperties.get('requiredErrorText') as FormControl;
  }

  addControl() {
    this.dateProperties.markAllAsTouched();
    if(this.dateProperties.valid){
      this.formService.createDate(this.dateProperties.getRawValue());
    }
  }
}
