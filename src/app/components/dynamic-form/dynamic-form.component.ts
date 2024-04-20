import {Component, Input} from '@angular/core';
import {CommonModule, NgForOf, NgSwitchCase} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TuiButtonModule, TuiGroupModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiInputDateRangeModule,
  TuiInputModule,
  TuiRadioBlockModule
} from "@taiga-ui/kit";
import {FormLayout} from "../../core/form/form-layout.interface";
import {FormConfiguration} from "../../core/form/form-configuration.interface";
import {FormService} from "../../core/form/form.service";

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiInputDateRangeModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiRadioBlockModule,
    TuiGroupModule,
    TuiCheckboxLabeledModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {

  _layout!:FormConfiguration;

  formGroup !:FormGroup;
  @Input() public set layout(val: FormConfiguration){
    this._layout = val;
    this.formGroup = this.fb.group({});
    this._layout.configurations.forEach(formLayout => {
      for (const formGroupLayout of formLayout.form_groups) {
        if(formGroupLayout.type === 'checkbox'){
          const formControls = formGroupLayout.options.map(controlLayout=>new FormControl(controlLayout.value));
          this.formGroup.addControl(formGroupLayout.name, new FormArray(formControls))
        }else{
          this.formGroup.addControl(formGroupLayout.name, new FormControl(formGroupLayout.value));
        }
      }
      // this.formGroupArray.push({
      //   title: new FormControl(formLayout.title),
      //   formGroup: formGroup
      // });
    })
    console.log(this.formGroup);
    this.formGroup.valueChanges.subscribe(res=>console.log(res));
  };

  formGroupArray: { title: FormControl, formGroup: FormGroup }[] = [];

  constructor(private formService: FormService, private fb: FormBuilder) {

    for(let i = 0;i < this.formGroupArray.length; i++){

    }

  }

  getFormArray(controlName: string){
    return this.formGroup.controls[controlName] as FormArray;
  }

  submit() {
    console.log("Hi");
  }
}
