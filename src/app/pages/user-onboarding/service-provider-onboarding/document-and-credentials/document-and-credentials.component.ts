import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiFileLike,
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiInputTagModule,
  TuiMarkerIconModule,
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
import {
  DocumentAndCredentialsForm,
  ServiceProviderSignupService
} from "../../../../core/service-provider/service-provider-signup.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MultipleFileUploadComponent} from "../../../../components/multiple-file-upload/multiple-file-upload.component";
import {AlertService} from "../../../../core/service/alert.service";
import {FileInputComponent} from "../../../../components/file-input/file-input.component";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent, Status} from "../../../../components/alert-dialog/alert-dialog.component";
import {ProviderService} from "../../../../core/service-provider/service-provider.service";
import {FileService} from "../../../../core/file/file.service";

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
    TuiFieldErrorPipeModule,
    FileInputComponent
  ],
  templateUrl: './document-and-credentials.component.html',
  styleUrl: './document-and-credentials.component.scss'
})
export class DocumentAndCredentialsComponent implements OnInit {


  documentAndCredentialsForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder,
              private serviceProviderSignUpService: ServiceProviderSignupService,
              private providerService: ProviderService,
              private matDialog: MatDialog,
             private fileService: FileService
  ) {

    this.documentAndCredentialsForm = this.fb.group({
      business_profile_image: [null, Validators.required],
      front_identity_card: [null, Validators.required],
      back_identity_card: [null, Validators.required],
      ssm: [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  get businessProfileControl(){
    return this.documentAndCredentialsForm.get('business_profile_image') as FormControl;
  }
  get frontIdentificationCardControl() {
    return this.documentAndCredentialsForm.get('front_identity_card') as FormControl;
  }

  get backIdentificationCardControl() {
    return this.documentAndCredentialsForm.get('back_identity_card') as FormControl;
  }

  get ssmControl() {
    return this.documentAndCredentialsForm.get('ssm') as FormControl;
  }

  nextStep() {
    this.documentAndCredentialsForm.markAllAsTouched();

    if (this.documentAndCredentialsForm.valid) {
      this.isSubmitting = true;
      this.serviceProviderSignUpService.setDocumentAndCredentialsFormData(this.documentAndCredentialsForm.getRawValue());
      this.fileService.uploadServiceProviderDocuments(this.serviceProviderSignUpService.getDocument() as DocumentAndCredentialsForm)
        .subscribe({
          next: res => {
            setTimeout(() => {
              this.isSubmitting = false
            }, 2000);
            this.serviceProviderSignUpService.nextStep();
          },
          error: err => {
            this.isSubmitting = false;
          }
        });
      //this.serviceProviderSignUpService.nextStep();
    } else {
      this.matDialog.open(AlertDialogComponent, {
        data: {
          title: 'Incomplete form',
          text: 'Please fill in all the fields before proceed',
          status: Status.ERROR
        }
      })
    }
  }

  prevStep() {

  }
}
