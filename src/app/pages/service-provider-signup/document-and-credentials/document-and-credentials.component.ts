import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from "@angular/common";
import {
  TUI_VALIDATION_ERRORS,
  TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiFileLike, TuiInputFilesModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiInputTagModule, TuiMarkerIconModule,
  TuiTextareaModule
} from "@taiga-ui/kit";
import {
  TuiErrorModule,
  TuiLabelModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
  TuiTooltipModule
} from "@taiga-ui/core";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ServiceProviderSignupService} from "../../../core/service-provider/service-provider-signup.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MultipleFileUploadComponent} from "../../../components/multiple-file-upload/multiple-file-upload.component";
import {AlertService} from "../../../core/service/alert.service";

@Component({
  selector: 'app-document-and-credentials',
  standalone: true,
  imports: [
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiInputTagModule,
    TuiLabelModule,
    TuiTextareaModule,
    TuiTextfieldControllerModule,
    TuiTooltipModule,
    RouterModule,
    CommonModule,
    FormsModule,
    TuiInputFilesModule,
    TuiSvgModule,
    TuiMarkerIconModule,
    MultipleFileUploadComponent,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DocumentAndCredentialsComponent,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Required',
        email: 'Enter a valid email',
        maxlength: ({requiredLength}: { requiredLength: string }) =>
          `Maximum length — ${requiredLength}`,
        usernameExists: 'Username is taken',
        phoneNumberExists: 'Phone number is taken'
      }
    }
  ],
  templateUrl: './document-and-credentials.component.html',
  styleUrl: './document-and-credentials.component.scss'
})
export class DocumentAndCredentialsComponent implements OnInit{

  currentIndex = 0;
  routes: any[] = [];

  documentAndCredentialsForm:FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb:FormBuilder,
              private serviceProviderSignUpService: ServiceProviderSignupService, private alertService:AlertService) {
    this.currentIndex = activatedRoute.snapshot.data?.['index'];
    this.routes = this.router.config.filter(route => route.path === 'service-provider-signup')
      .flatMap(parentRoute => parentRoute.children).filter(route => route?.path !== '');
    this.setActiveIndex(this.currentIndex);
    this.documentAndCredentialsForm = this.fb.group({
      personal_identification:[[],[Validators.required]],
      awards:[[]],
      customer_testimonials:[[]],
      social_media_link:this.fb.group({
        facebook:['', Validators.required],
        instagram:['', Validators.required],
        tiktok:['', Validators.required]
      })
    });
  }

  ngOnInit() {
    this.retainOldFormData();
   // this.documentAndCredentialsForm.controls['personal_identification'].setValue({name:'Hi'} as File);
  }

  retainOldFormData(){
    if(this.serviceProviderSignUpService.documentAndCredentialsFormData.value){
      console.log(this.serviceProviderSignUpService.documentAndCredentialsFormData.value);
      this.documentAndCredentialsForm.setValue(this.serviceProviderSignUpService.documentAndCredentialsFormData.value);
    }
  }

  readonly file: TuiFileLike = {
    name: 'custom.txt',
  };


  get personalIdentificationFormControl(){
    return this.documentAndCredentialsForm.controls['personal_identification'] as FormControl;
  }

  get awardsFormControl(){
    return this.documentAndCredentialsForm.controls['awards'] as FormControl;
  }

  get customerTestimonialsFormControl(){
    return this.documentAndCredentialsForm.controls['customer_testimonials'] as FormControl;
  }
  submitDocumentAndCredentials() {
    this.documentAndCredentialsForm.markAllAsTouched();
    if(this.documentAndCredentialsForm.invalid){
      this.alertService.showError(`Please fill in all the required fields`);
    }else{
      console.log(this.documentAndCredentialsForm);
      //this.setActiveIndex(this.currentIndex + 1);
      this.router.navigate([`../${this.routes[this.currentIndex+1].path}`],{relativeTo:this.activatedRoute})
        .then(res=>{
          if(res){
            this.setActiveIndex(this.currentIndex + 1);
            this.serviceProviderSignUpService.setDocumentCredentialsFormValid(this.documentAndCredentialsForm.valid);
            this.serviceProviderSignUpService.setDocumentAndCredentialsFormData(this.documentAndCredentialsForm.getRawValue());
          }
        });
    }
  }

  setActiveIndex(index: number) {
    this.serviceProviderSignUpService.setCurrentIndex(index);
  }
}
