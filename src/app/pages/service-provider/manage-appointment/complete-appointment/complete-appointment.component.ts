import {Component, Inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, CurrencyPipe, NgIf} from "@angular/common";
import {BadgeComponent} from "../../../../components/badge/badge.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {DropdownComponent} from "../../../../components/dropdown/dropdown.component";
import {initFlowbite} from "flowbite";
import {forkJoin, map, Observable} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AppointmentTable} from "../../../../core/appointment/appointment-table.interface";
import {ProviderBusinessService} from "../../../../core/service-provider/provider-business.service";
import {CustomerService} from "../../../../core/customer/customer.service";
import {AppointmentService} from "../../../../core/appointment/appointment.service";
import {ServiceDetails} from "../../../../core/service-provider/service-details.interface";
import {Customer} from "../../../../core/customer/customer.interface";
import {Appointment} from "../../../../core/appointment/appointment.interface";
import {FileInputDropzoneComponent} from "../../../../components/file-input-dropzone/file-input-dropzone.component";
import {FormControl, Validators} from "@angular/forms";
import {FileService} from "../../../../core/file/file.service";
import {ToastService} from "../../../../core/dialog/toast.service";

@Component({
  selector: 'app-complete-appointment',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    DropdownComponent,
    FileInputDropzoneComponent,
  ],
  templateUrl: './complete-appointment.component.html',
  styleUrl: './complete-appointment.component.scss'
})
export class CompleteAppointmentComponent implements OnInit {

  appointmentInfo$ !: Observable<[ServiceDetails, Customer, Appointment]>;
  fileControl: FormControl = new FormControl(null, Validators.required);

  disableSubmitBtn: boolean = false;

  constructor(public dialogRef: MatDialogRef<CompleteAppointmentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { appointment: AppointmentTable },
              private businessService: ProviderBusinessService,
              private customerService: CustomerService,
              private appointmentService: AppointmentService,
              private dialog: MatDialog,
              private fileService: FileService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    initFlowbite();
    this.appointmentInfo$ = forkJoin([this.businessService.findDetailsById(this.data.appointment.service_id),
      this.customerService.findById(this.data.appointment.customer_id), this.appointmentService.findById(this.data.appointment.service_id, this.data.appointment.service_provider_id,
        this.data.appointment.customer_id, this.data.appointment.created_at).pipe(map(appointment => {
        return appointment;
      }))]);
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.fileControl.markAllAsTouched();

    if (this.fileControl.valid) {
      this.disableSubmitBtn = true;
      this.fileService.uploadCompleteAppointmentEvidence(this.data.appointment.id, this.data.appointment.service_id, this.data.appointment.service_provider_id, this.data.appointment.customer_id, this.data.appointment.created_at,
        this.fileControl.getRawValue()).subscribe({
        next: res => {
          this.appointmentService.refreshServiceProviderManageAppointment$.next();
          this.dialog.closeAll();
          this.disableSubmitBtn = false;
          this.toastService.open('Evidences has been submitted to admin for review', 'success');
        },
        error: err => {
          this.toastService.open('Something went wrong when submitting evidences', 'error');
          this.disableSubmitBtn = false;
        }

      })
    }
  }
}
