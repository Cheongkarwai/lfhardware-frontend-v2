import {Component, OnInit} from '@angular/core';
import {TuiComboBoxModule, TuiDataListWrapperModule, TuiInputModule, TuiTabsModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AlertService} from "../../../core/service/alert.service";
import {FormService} from "../../../core/form/form.service";
import {DynamicFormComponent} from "../../../components/dynamic-form/dynamic-form.component";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {map, Observable} from "rxjs";
import {FormLayout} from "../../../core/form/form-layout.interface";
import {FormConfiguration} from "../../../core/form/form-configuration.interface";
import {Model} from "survey-core";
import {SurveyModule} from "survey-angular-ui";
import {ButtonComponent} from "../../../components/button/button.component";
import {RadioButtonFormComponent} from "./radio-button-form/radio-button-form.component";
import {InputTextFormComponent} from "./input-text-form/input-text-form.component";
import {CheckboxFormComponent} from "./checkbox-form/checkbox-form.component";
import {DateFormComponent} from "./date-form/date-form.component";

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [
    TuiTabsModule,
    TuiSvgModule,
    TuiComboBoxModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    CommonModule,
    TuiInputModule,
    TuiButtonModule,
    DynamicFormComponent,
    SurveyModule,
    ButtonComponent,
    RadioButtonFormComponent,
    InputTextFormComponent,
    CheckboxFormComponent,
    DateFormComponent

  ],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss'
})
export class CreateFormComponent implements OnInit {
  activeItemIndex = 0;

  serviceControl = new FormControl();
  items = [1, 2, 3];

  form = new FormGroup({});
  model = {email: 'email@gmail.com'};

  surveyJson = {
    elements: [{
      name: "FirstName",
      title: "Enter your first name:",
      type: "text"
    }, {
      name: "LastName",
      title: "Enter your last name:",
      type: "text",
      "isRequired": true,
      "requiredErrorText": "Value cannot be empty"
    }, {
      "type": "radiogroup",
      "name": "car",
      "title": "Which is the brand of your car?",
      "isRequired": true,
      "showNoneItem": true,
      "showOtherItem": true,
      "colCount": 1,
      "choices": [{text: "Ford", value: 100}],
      "separateSpecialChoices": true,
      "showClearButton": true
    }],
  };


  // formGroup:FormGroup;

  formGroupArray: { title: FormControl, formGroup: FormGroup }[] = [];

  surveyModel!: Model;
  selectControl: FormControl = new FormControl('');

  configuration$: Observable<any>;

  constructor(private fb: FormBuilder, private formService: FormService, private alertService: AlertService,
              private providerService: ProviderService) {
    this.configuration$ = this.formService.formConfigurationObs.pipe(map(configuration=> {
      console.log(configuration);
      this.surveyModel = new Model(configuration);
      return configuration;
    }))
  }

  ngOnInit() {
    console.log(JSON.stringify(this.surveyJson));
    this.surveyModel = new Model({
      "elements": [
        {
          "type": "dropdown",
          "name": "country",
          "title": "Select a country",
          "isRequired": true,
          "defaultValue": "FRA",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 40
        },
        {
          "name": "date",
          "type": "text",
          "title": "Select a future date",
          "inputType": "date",
          "defaultValueExpression": "today()",
          "minValueExpression": "today()",
          "isRequired": true
        }, {
          "name": "date",
          "type": "text",
          "title": "Select a past date within 30 days before today",
          "inputType": "date",
          "minValueExpression": "today(-30)",
          "maxValueExpression": "today()",
          "isRequired": true
        }, {
          "name": "time",
          "type": "text",
          "title": "Select a time between 09:00 and 18:00",
          "inputType": "time",
          "min": "09:00",
          "max": "18:00",
          "isRequired": true
        }, {
          "name": "datetime-local",
          "type": "text",
          "title": "Select a date and time",
          "inputType": "datetime-local",
          "defaultValueExpression": "currentDate()"
        }, {
          "name": "month",
          "type": "text",
          "title": "Select a month",
          "inputType": "month"
        }, {
          "name": "week",
          "type": "text",
          "title": "Select a week",
          "inputType": "week"
        }
      ],
      "showQuestionNumbers": false,
      "fitToContainer": true
    });
    this.surveyModel.onComplete.add(this.submitFormResult);
  }

  submitFormResult(survey: Model) {
    console.log(survey.getValue("car"));
    console.log(survey.data);
  }


  addControl() {
    // const {type, label} = this.createFormGroup.getRawValue();
    // const json = this.formService.createJsonForm(type, label, this.layouts[this.layouts.length - 1].form_groups.length);
    // this.layouts[this.layouts.length - 1].form_groups.push(json as any);
    // this.addJsonToFormGroup(this.layouts.length -1);
    // this.createFormGroup.reset();
    // if (this.selectControl.getRawValue() === 'RADIOBUTTON') {
    //   const properties = {
    //     name: 'car',
    //     title: 'test',
    //     isRequired: true,
    //     choices: [{text: 'hi', value: '12'}]
    //   }
    //   this.formService.createRadioButton(properties);
    //   this.surveyModel = new Model(this.surveyJson);
    // }else if(this.selectControl.getRawValue() === 'INPUTTEXT'){
    //   console.log("Hi");
    //   const properties = {
    //     name: 'car',
    //     title: 'test',
    //     isRequired: true,
    //     requiredErrorText: 'lol'
    //   }
    //   const json = this.formService.createInputText(properties);
    //   this.surveyJson.elements.push(json);
    //   this.surveyModel = new Model(this.surveyJson);
    // }
  }

  createControl() {

  }

}
