import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormService} from "../../../../core/form/form.service";
import {Model} from "survey-core";

@Component({
  selector: 'app-input-text-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './input-text-form.component.html',
  styleUrl: './input-text-form.component.scss'
})
export class InputTextFormComponent {

  inputTextProperties: FormGroup;


  constructor(private fb: FormBuilder, private formService: FormService) {
    this.inputTextProperties = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      isRequired: [false],
      requiredErrorText: ['']
    });
  }

  get nameControl() {
    return this.inputTextProperties.get('name') as FormControl;
  }

  get titleControl() {
    return this.inputTextProperties.get('title') as FormControl;
  }

  get isRequiredControl() {
    return this.inputTextProperties.get('isRequired') as FormControl;
  }

  get requiredErrorTextControl() {
    return this.inputTextProperties.get('requiredErrorText') as FormControl;
  }

  addControl() {
    this.inputTextProperties.markAllAsTouched();
    if(this.inputTextProperties.valid){
      this.formService.createInputText(this.inputTextProperties.getRawValue());
    }
  }
}
