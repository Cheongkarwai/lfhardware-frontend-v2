import {Component} from '@angular/core';
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
  selector: 'app-radio-button-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './radio-button-form.component.html',
  styleUrl: './radio-button-form.component.scss'
})
export class RadioButtonFormComponent {

  radioButtonProperties: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.radioButtonProperties = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      isRequired: [false],
      requiredErrorText: [''],
      choices: this.fb.array([], Validators.required)
    });
  }

  get choiceFormArray() {
    return this.radioButtonProperties.get('choices') as FormArray;
  }

  get nameControl() {
    return this.radioButtonProperties.get('name') as FormControl;
  }

  get titleControl() {
    return this.radioButtonProperties.get('title') as FormControl;
  }

  get isRequiredControl() {
    return this.radioButtonProperties.get('isRequired') as FormControl;
  }

  get requiredErrorTextControl() {
    return this.radioButtonProperties.get('requiredErrorText') as FormControl;
  }

  addControl() {
    this.radioButtonProperties.markAllAsTouched();
    if(this.radioButtonProperties.valid){
      this.formService.createRadioButton(this.radioButtonProperties.getRawValue());
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
