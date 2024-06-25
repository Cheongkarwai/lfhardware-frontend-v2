import {Component, OnInit} from '@angular/core';
import {TuiComboBoxModule, TuiDataListWrapperModule, TuiInputModule, TuiTabsModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AlertService} from "../../../core/service/alert.service";
import {FormService} from "../../../core/form/form.service";
import {DynamicFormComponent} from "../../../components/dynamic-form/dynamic-form.component";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {Model} from "survey-core";
import {SurveyModule} from "survey-angular-ui";
import {ButtonComponent} from "../../../components/button/button.component";
import {RadioButtonFormComponent} from "./radio-button-form/radio-button-form.component";
import {InputTextFormComponent} from "./input-text-form/input-text-form.component";
import {CheckboxFormComponent} from "./checkbox-form/checkbox-form.component";
import {DateFormComponent} from "./date-form/date-form.component";
import {DatetimeFormComponent} from "./datetime-form/datetime-form.component";
import {DialogSubscriptionService} from "../../../core/dialog/dialog.service";
import {ConfirmationDialogComponent} from "../../../components/confirmation-dialog/confirmation-dialog.component";
import {Service} from "../../../core/service-provider/service.interface";
import {MatDialog} from "@angular/material/dialog";
import {ToastComponent} from "../../../components/toast/toast.component";
import {ToastService} from "../../../core/dialog/toast.service";

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
    DateFormComponent,
    DatetimeFormComponent,
    ConfirmationDialogComponent

  ],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss'
})
export class CreateFormComponent implements OnInit {
  activeItemIndex = 0;

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
  configuration$!: Observable<any>;
  services$!: Observable<Service[]>;

  selectControl!: FormControl;
  serviceControl!: FormControl<Service | null>;

  constructor(private fb: FormBuilder, private formService: FormService,
              private providerService: ProviderService, private dialog: MatDialog,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.selectControl = new FormControl('');
    this.serviceControl = new FormControl(null, Validators.required);
    this.surveyModel = new Model();
    this.services$ = this.providerService.findServiceProviderServices();
    this.configuration$ = combineLatest([this.formService.formConfigurationObs.pipe(startWith({elements: []})), this.serviceControl.valueChanges.pipe(startWith(null))])
      .pipe(switchMap(([form, service]) => {
        if (service) {
          return this.providerService.findServiceProviderFormByServiceId(service?.id)
            .pipe(map(configuration => {
              if (configuration) {
                configuration.configuration.elements.push(...form.elements);
                this.surveyModel.setJsonObject(configuration.configuration)
                return configuration.configuration;
              }
              // this.formService.configuration$.next({elements: []});
              this.surveyModel = new Model(form);
              return form;
            }))
        }
        return of(form);
      }), catchError(err => of({elements: []})))


    // this.configuration$ = this.serviceControl.valueChanges.pipe(startWith(null), switchMap((service) => {
    //   if (service) {
    //     return this.providerService.findServiceProviderFormByServiceId(service?.id)
    //       .pipe(map(configuration => {
    //         console.log(configuration)
    //         this.surveyModel = new Model(configuration.configuration);
    //         return configuration;
    //       }));
    //   }
    //   return of({} as any);
    // }), catchError(err => of({})));
    // return this.providerService.findServiceProviderFormByServiceId(3).subscribe(res=>console.log(res));
    // this.surveyModel = new Model({
    //   "elements": [
    //     {
    //       "type": "dropdown",
    //       "name": "country",
    //       "title": "Select a country",
    //       "isRequired": true,
    //       "defaultValue": "FRA",
    //       "choicesLazyLoadEnabled": true,
    //       "choicesLazyLoadPageSize": 40
    //     },
    //     {
    //       "name": "date",
    //       "type": "text",
    //       "title": "Select a future date",
    //       "inputType": "date",
    //       "defaultValueExpression": "today()",
    //       "minValueExpression": "today()",
    //       "isRequired": true
    //     }, {
    //       "name": "date",
    //       "type": "text",
    //       "title": "Select a past date within 30 days before today",
    //       "inputType": "date",
    //       "minValueExpression": "today(-30)",
    //       "maxValueExpression": "today()",
    //       "isRequired": true
    //     }, {
    //       "name": "time",
    //       "type": "text",
    //       "title": "Select a time between 09:00 and 18:00",
    //       "inputType": "time",
    //       "min": "09:00",
    //       "max": "18:00",
    //       "isRequired": true
    //     }, {
    //       "name": "datetime-local",
    //       "type": "text",
    //       "title": "Select a date and time",
    //       "inputType": "datetime-local",
    //       "defaultValueExpression": "currentDate()"
    //     }, {
    //       "name": "month",
    //       "type": "text",
    //       "title": "Select a month",
    //       "inputType": "month"
    //     }, {
    //       "name": "week",
    //       "type": "text",
    //       "title": "Select a week",
    //       "inputType": "week"
    //     }
    //   ],
    //   "showQuestionNumbers": false,
    //   "fitToContainer": true
    // });
    this.surveyModel.onComplete.add(this.submitFormResult);
  }

  submitFormResult(survey: Model) {
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

  saveForm() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Save this form',
        text: 'Are you sure you want to save this form?',
        icon: 'error'
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.serviceControl.markAllAsTouched();
        if (this.serviceControl.valid && this.formService.configuration$.value.elements.length > 0) {
          const formConfiguration: { elements: any[] } = this.surveyModel.toJSON().pages[0];
          const service: Service | null = this.serviceControl.getRawValue();
          this.formService.saveQuoteForm(formConfiguration, service)
            .subscribe({
              next: res => this.toastService.open('Successfully saved', 'success'),
              error: err => {}
            });
        } else {

        }
      }
    });

  }
}
