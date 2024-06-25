import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MultipleFileUploadComponent} from "../../../../components/multiple-file-upload/multiple-file-upload.component";
import {TuiInputModule, TuiInputNumberModule, TuiTextareaModule} from "@taiga-ui/kit";
import {TuiLabelModule, TuiTextfieldControllerModule, TuiTooltipModule} from "@taiga-ui/core";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {
  BankingDetailsForm, ContactInfo, Coverage,
  ServiceProviderSignupService, SocialMediaLink
} from "../../../../core/service-provider/service-provider-signup.service";
import {ServiceProviderAccount} from "../../../../core/service-provider/service-provider-account.interface";
import {Service} from "../../../../core/service-provider/service.interface";
import {AlertService} from "../../../../core/service/alert.service";

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MultipleFileUploadComponent,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
    TuiTooltipModule,
    TuiTextareaModule
  ],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss'
})
export class AlbumComponent implements OnInit {

  currentIndex = 0;
  routes: any[] = [];

  albumForm: FormGroup;

  isSubmitting = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private fb: FormBuilder, private serviceProviderSignupFormService: ServiceProviderSignupService,
              private alertService: AlertService) {
    this.currentIndex = activatedRoute.snapshot.data?.['index'];
    this.routes = this.router.config.filter(route => route.path === 'service-provider-signup')
      .flatMap(parentRoute => parentRoute.children).filter(route => route?.path !== '');
    this.setActiveIndex(this.currentIndex);
    this.albumForm = this.fb.group({
      name: [''],
      description: [''],
      photos: [[]]
    });
  }

  ngOnInit() {

  }

  setActiveIndex(index: number) {
    this.serviceProviderSignupFormService.setCurrentIndex(index);
  }

  get photosFormControl() {
    return this.albumForm.controls['photos'] as FormControl;
  }

  complete() {
    // if(this.serviceProviderSignupFormService.albumsFormValid$.value && this.serviceProviderSignupFormService.basicInfoFormValid$.value
    // && this.serviceProviderSignupFormService.bankingDetailsFormValid$.value && this.serviceProviderSignupFormService.documentCredentialsFormValid$.value){
    //
    //   this.isSubmitting = true;
    //   //this.serviceProviderSignupFormService.setFormSubmitState(true);
    //   const basicInfoForm = this.serviceProviderSignupFormService.basicInfoFormData.value;
    //   const documentAndCredentialsForm = this.serviceProviderSignupFormService.documentAndCredentialsFormData.value;
    //   const bankDetailsFormData = this.serviceProviderSignupFormService.bankDetailsFormData.value;
    //   const serviceAccount: ServiceProviderAccount = {
    //     account: {
    //       username: basicInfoForm?.business_details.email_address as string,
    //       password: '123456',
    //       profile: {
    //         email_address: basicInfoForm?.service_details.contact_info.email_address as string,
    //         phone_number: basicInfoForm?.service_details.contact_info.phone_number as string,
    //         address: {
    //           address_line_1: '',
    //           address_line_2: '',
    //           state: '',
    //           city: '',
    //           zipcode: '',
    //           country: ''
    //         }
    //       },
    //       email_verified: false,
    //       roles: [{id: 3,name: 'SERVICE_PROVIDER'}],
    //       disabled: true
    //     },
    //     service_provider: {
    //       name: basicInfoForm?.business_details.name as string,
    //       description: basicInfoForm?.business_details.description as string,
    //       address: basicInfoForm?.business_details.address as string,
    //       contact_info: basicInfoForm?.service_details.contact_info as ContactInfo,
    //       bank_details: bankDetailsFormData as BankingDetailsForm,
    //       social_media_link: documentAndCredentialsForm?.social_media_link as SocialMediaLink,
    //       album: {
    //         name: '',
    //         description: '',
    //         photos: []
    //       },
    //       type_of_services: basicInfoForm?.service_details.type_of_services as Service[],
    //       coverage: basicInfoForm?.service_details.coverage as Coverage
    //     }
    //   };
    //
    //   this.serviceProviderSignupFormService.register(serviceAccount)
    //     .subscribe({
    //       next: res => {
    //         this.isSubmitting = false;
    //         this.router.navigate(['']).then(result => this.alertService.showSuccess('Submitted. Your application will be reviewed in few days.'))
    //         //this.serviceProviderSignupFormService.setFormSubmitState(true);
    //       },
    //       error: err => this.alertService.showError(`Something went wrong`)
    //     });
    // }else if(!this.serviceProviderSignupFormService.basicInfoFormValid$.value){
    //   this.router.navigate(['../basic-information'],{relativeTo: this.activatedRoute})
    // }else if(!this.serviceProviderSignupFormService.documentCredentialsFormValid$.value){
    //   this.router.navigate(['../document-and-credentials'], {relativeTo: this.activatedRoute})
    // }else if(!this.serviceProviderSignupFormService.bankingDetailsFormValid$.value){
    //   this.router.navigate(['../banking-details'], {relativeTo: this.activatedRoute})
    // }else if(!this.serviceProviderSignupFormService.albumsFormValid$.value){
    //   this.router.navigate(['../albums'], {relativeTo: this.activatedRoute})
    // }
  }

}
