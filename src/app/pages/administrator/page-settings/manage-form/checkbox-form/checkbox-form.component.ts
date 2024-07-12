import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {FormService} from "../../../../../core/form/form.service";

@Component({
  selector: 'app-checkbox-form',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox-form.component.html',
  styleUrl: './checkbox-form.component.scss'
})
export class CheckboxFormComponent {
  checkboxProperties: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.checkboxProperties = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      isRequired: [false],
      requiredErrorText: [''],
      choices: this.fb.array([], Validators.required)
    });
  }

  get choiceFormArray() {
    return this.checkboxProperties.get('choices') as FormArray;
  }

  get nameControl() {
    return this.checkboxProperties.get('name') as FormControl;
  }

  get titleControl() {
    return this.checkboxProperties.get('title') as FormControl;
  }

  get isRequiredControl() {
    return this.checkboxProperties.get('isRequired') as FormControl;
  }

  get requiredErrorTextControl() {
    return this.checkboxProperties.get('requiredErrorText') as FormControl;
  }

  addControl() {
    this.checkboxProperties.markAllAsTouched();
    if(this.checkboxProperties.valid){
      this.formService.createCheckbox(this.checkboxProperties.getRawValue());
    }
  }

  addChoice() {
    this.choiceFormArray.push(this.fb.group({
      title: ['', Validators.required],
      value: ['',Validators.required]
    }));
  }

  removeChoice(i: number) {
    this.choiceFormArray.removeAt(i);
  }
}
