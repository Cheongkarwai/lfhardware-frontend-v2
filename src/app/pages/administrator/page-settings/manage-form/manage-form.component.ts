import { Component } from '@angular/core';
import {Breadcrumb, BreadcrumbComponent} from "../../../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../../../components/button/button.component";
import {CheckboxFormComponent} from "../../../service-provider/create-form/checkbox-form/checkbox-form.component";
import {DateFormComponent} from "../../../service-provider/create-form/date-form/date-form.component";
import {DatetimeFormComponent} from "../../../service-provider/create-form/datetime-form/datetime-form.component";
import {InputTextFormComponent} from "../../../service-provider/create-form/input-text-form/input-text-form.component";
import {PaginatorModule} from "primeng/paginator";
import {
  RadioButtonFormComponent
} from "../../../service-provider/create-form/radio-button-form/radio-button-form.component";
import {SurveyModule} from "survey-angular-ui";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Model} from "survey-core";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {Service} from "../../../../core/service-provider/service.interface";
import {FormService} from "../../../../core/form/form.service";
import {ProviderService} from "../../../../core/service-provider/service-provider.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../../../core/dialog/toast.service";
import {ConfirmationDialogComponent} from "../../../../components/confirmation-dialog/confirmation-dialog.component";
import {ProviderBusinessService} from "../../../../core/service-provider/provider-business.service";

@Component({
  selector: 'app-manage-form',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ButtonComponent,
    CheckboxFormComponent,
    DateFormComponent,
    DatetimeFormComponent,
    InputTextFormComponent,
    PaginatorModule,
    RadioButtonFormComponent,
    SurveyModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.scss'
})
export class ManageFormComponent {
  breadcrumbItems: Breadcrumb[] = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Page Settings',
      routerLink: '/page-settings'
    },
    {
      caption: 'Manage Form',
      routerLink: '/manage-form'
    },
  ];

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

  surveyModel: Model = new Model();
  configuration$!: Observable<any>;
  services$!: Observable<Service[]>;

  selectControl: FormControl  = new FormControl('');
  serviceControl: FormControl<Service | null>  = new FormControl(null, Validators.required);

  constructor(private fb: FormBuilder, private formService: FormService,
              private businessService: ProviderBusinessService, private dialog: MatDialog,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.findServices();
    this.findConfiguration();
    this.surveyModel.onComplete.add(this.submitFormResult);
  }

  findServices(){
    this.services$ = this.businessService.findAllServices()
      .pipe(map(serviceCategories=>{
        return serviceCategories.flatMap(e=> e.services);
      }));
  }
  findConfiguration(){
    this.configuration$ = combineLatest([this.formService.formConfigurationObs.pipe(startWith({elements: []})), this.serviceControl.valueChanges.pipe(startWith(null))])
      .pipe(switchMap(([form, service]) => {
        if (service) {
          return this.businessService.findFormByServiceId(service?.id)
            .pipe(map(configuration => {
              if (configuration) {
                configuration.configuration.elements.push(...form.elements);
                console.log(configuration.configuration);
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
