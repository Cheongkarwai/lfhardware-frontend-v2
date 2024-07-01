import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {forkJoin, map, Observable, startWith, switchMap} from "rxjs";
import {initFlowbite} from "flowbite";
import {BadgeComponent} from "../../../../../components/badge/badge.component";
import {DropdownComponent} from "../../../../../components/dropdown/dropdown.component";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {ServiceDetails} from "../../../../../core/service-provider/service-details.interface";
import {Customer} from "../../../../../core/customer/customer.interface";
import {Appointment, AppointmentCompletionImage} from "../../../../../core/appointment/appointment.interface";
import {AppointmentTable} from "../../../../../core/appointment/appointment-table.interface";
import {ProviderBusinessService} from "../../../../../core/service-provider/provider-business.service";
import {CustomerService} from "../../../../../core/customer/customer.service";
import {AppointmentService} from "../../../../../core/appointment/appointment.service";
import {
  ImagePreviewComponent
} from "../../../../service-provider/manage-appointment/image-preview/image-preview.component";
import {
  AppointmentProgressBarComponent
} from "../../../../../components/appointment-progress-bar/appointment-progress-bar.component";
import {ConfirmationDialogComponent} from "../../../../../components/confirmation-dialog/confirmation-dialog.component";
import {ToastService} from "../../../../../core/dialog/toast.service";
import {ProviderService} from "../../../../../core/service-provider/service-provider.service";
import {ServiceProviderDetails} from "../../../../../core/service-provider/service-provider-details";
import {PaymentService} from "../../../../../core/payment/payment.service";

@Component({
  selector: 'app-view-appointment',
  standalone: true,
  imports: [CommonModule, BadgeComponent, DropdownComponent, ButtonComponent, AppointmentProgressBarComponent],
  providers: [CurrencyPipe],
  templateUrl: './view-appointment.component.html',
  styleUrl: './view-appointment.component.scss'
})
export class ViewAppointmentComponent implements OnInit {

  appointmentInfo$ !: Observable<[ServiceDetails, Customer, Appointment, ServiceProviderDetails]>;
  images: string [] = [];

  constructor(public dialogRef: MatDialogRef<ViewAppointmentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { appointment: AppointmentTable },
              private businessService: ProviderBusinessService,
              private providerService: ProviderService,
              private customerService: CustomerService,
              private appointmentService: AppointmentService,
              private dialog: MatDialog,
              private toastService: ToastService,
              private paymentService: PaymentService,
              private currencyPipe: CurrencyPipe) {
  }

  ngOnInit() {
    initFlowbite();
    this.appointmentInfo$ = this.appointmentService.refreshServiceProviderManageAppointment$.pipe(startWith(''), switchMap(e => {
      return forkJoin([this.businessService.findDetailsById(this.data.appointment.service_id),
        this.customerService.findById(this.data.appointment.customer_id), this.appointmentService.findById(this.data.appointment.service_id, this.data.appointment.service_provider_id,
          this.data.appointment.customer_id, this.data.appointment.created_at).pipe(map(appointment => {
          this.images = appointment.appointment_completion_images.map(image => image.path);
          return appointment;
        })), this.providerService.findById(this.data.appointment.service_provider_id)]);
    }));
  }


  getUpdateStatusMessage(status: string, id: string) {
    if (status === 'CANCELLED') {
      return `Appointment #${id} will be cancelled`;
    } else if (status === 'COMPLETED') {
      return `Appointment #${id} is completed`
    } else if (status === 'WORK_IN_PROGRESS') {
      return `Appointment #${id} is in progress`;
    } else if (status === 'CONFIRMED') {
      return `Appointment #${id} is confirmed`;
    }else if(status === 'REVIEW'){
      return `Appointment #${id} has been reviewed`
    }
    return '';
  }

  close() {
    this.dialogRef.close();
  }


  updateStatus(status: string) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Update appointment status to ${status}`,
        text: `Are you sure you want to update appointment status to ${status}? All of the data will be permanently updated. This action cannot be undone.`,
        icon: 'warning'
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.appointmentService.updateAppointmentStatus({
          ids: [{
            customer_id: this.data.appointment.customer_id,
            service_id: this.data.appointment.service_id,
            created_at: this.data.appointment.created_at,
            service_provider_id: this.data.appointment.service_provider_id
          }],

          status: status
        }).subscribe({
          next: res => {
            this.dialogRef.close();
            this.dialogRef.afterClosed().subscribe({
              next: res => {
                this.appointmentService.refreshServiceProviderManageAppointment$.next();
                this.toastService.open(this.getUpdateStatusMessage(status, this.data.appointment.id), 'success')
              }
            });
          },
          error: err => this.toastService.open(`Something went wrong when updating appointment status to ${status}`, 'success')

        });
      }
    });

  }

  //
  // completeAppointment() {
  //   this.dialog.open(CompleteAppointmentComponent, {
  //     data: {
  //       appointment: this.data.appointment
  //     }
  //   });
  // }

  viewScreenshots(appointment_completion_images: AppointmentCompletionImage[]) {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        images: appointment_completion_images.map(image => image.path)
      }
    });
  }

  releasePayment(appointment: Appointment){

    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Release payment of ${this.currencyPipe.transform(appointment.estimated_price, 'MYR')}`,
        text: `Are you sure you want to release payment to ${appointment.service_provider.name}? All of the data will be permanently updated. This action cannot be undone.`,
        icon: 'warning'
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.appointmentService.createTransfer(appointment.service.id, appointment.service_provider.id, appointment.customer.id, appointment.created_at)
          .subscribe({
            next:res=> {
              this.dialogRef.close();
              this.dialogRef.afterClosed().subscribe({
                next: res => {
                  this.appointmentService.refreshServiceProviderManageAppointment$.next();
                  this.toastService.open(`#Appointment ${appointment.id} with estimated price of RM${appointment.estimated_price} is released to ${appointment.service_provider.name}`, 'success')
                }
              });
            }
          });
      }
    });
  }

}
