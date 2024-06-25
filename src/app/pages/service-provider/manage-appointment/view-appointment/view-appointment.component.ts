import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Appointment, AppointmentCompletionImage} from "../../../../core/appointment/appointment.interface";
import {ProviderBusinessService} from "../../../../core/service-provider/provider-business.service";
import {forkJoin, map, Observable, startWith, switchMap} from "rxjs";
import {ServiceDetails} from "../../../../core/service-provider/service-details.interface";
import {CustomerService} from "../../../../core/customer/customer.service";
import {Customer} from "../../../../core/customer/customer.interface";
import {AppointmentTable} from "../../../../core/appointment/appointment-table.interface";
import {initFlowbite} from "flowbite";
import {ConfirmationDialogComponent} from "../../../../components/confirmation-dialog/confirmation-dialog.component";
import {AlertDialogComponent, Status} from "../../../../components/alert-dialog/alert-dialog.component";
import {AppointmentService} from "../../../../core/appointment/appointment.service";
import {BadgeComponent} from "../../../../components/badge/badge.component";
import {DropdownComponent, DropdownItem} from "../../../../components/dropdown/dropdown.component";
import {FormControl, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../components/button/button.component";
import {CompleteAppointmentComponent} from "../complete-appointment/complete-appointment.component";
import {ImagePreviewComponent} from "../image-preview/image-preview.component";

@Component({
  selector: 'app-view-appointment',
  standalone: true,
  imports: [CommonModule, BadgeComponent, DropdownComponent, ButtonComponent],
  templateUrl: './view-appointment.component.html',
  styleUrl: './view-appointment.component.scss'
})
export class ViewAppointmentComponent implements OnInit {

  appointmentInfo$ !: Observable<[ServiceDetails, Customer, Appointment]>;
  statusItems: DropdownItem[] = [];
  statusControl: FormControl<string | null> = new FormControl<string | null>('', Validators.required);

  images:string [] = [];
  constructor(public dialogRef: MatDialogRef<ViewAppointmentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { appointment: AppointmentTable },
              private businessService: ProviderBusinessService,
              private customerService: CustomerService,
              private appointmentService: AppointmentService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    initFlowbite();
    this.appointmentInfo$ = this.appointmentService.refreshServiceProviderManageAppointment$.pipe(startWith(''), switchMap(e => {
      return forkJoin([this.businessService.findDetailsById(this.data.appointment.service_id),
        this.customerService.findById(this.data.appointment.customer_id), this.appointmentService.findById(this.data.appointment.service_id, this.data.appointment.service_provider_id,
          this.data.appointment.customer_id, this.data.appointment.created_at).pipe(map(appointment => {
            this.images = appointment.appointment_completion_images.map(image=> image.path);
          this.initializeStatusDropdown(appointment);
          return appointment;
        }))]);
    }));
  }

  initializeStatusDropdown(appointment: Appointment) {
    if (appointment.status === 'PENDING') {
      this.statusItems = [
        {title: 'Cancel', value: 'CANCELLED'},
        {title: 'Confirm', value: 'CONFIRMED'},
      ];
    } else if (appointment.status === 'CONFIRMED') {
      this.statusItems = [
        {title: 'Work in progress', value: 'WORK_IN_PROGRESS'},
      ];
    } else if (appointment.status === 'WORK_IN_PROGRESS') {
      this.statusItems = [
        {title: 'Work completed', value: 'WORK_COMPLETED'},
      ];
    }
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
    }
    return '';
  }

  close() {
    this.dialogRef.close();
  }

  complete() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Mark appointment as completed',
        text: 'Are you sure you want to update appointment status to completed? All of the data will be permanently updated. This action cannot be undone.',
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

          status: 'COMPLETED'
        }).subscribe({
          next: res => {
            this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Success',
                text: "Appointment status is updated",
                status: Status.SUCCESS
              }
            }).afterClosed().subscribe(res => {
              this.dialogRef.close();
            })
          },
          error: err => {

          }
        });
      }
    });
  }

  cancel() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Mark appointment as cancelled',
        text: 'Are you sure you want to update appointment status to cancelled? All of the data will be permanently updated. This action cannot be undone.',
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

          status: 'CANCELLED'
        }).subscribe({
          next: res => {
            this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Success',
                text: "Appointment status is updated",
                status: Status.SUCCESS
              }
            }).afterClosed().subscribe(res => {
              this.dialogRef.close();
            })
          },
          error: err => {

          }
        });
      }
    })
  }


  updateStatus() {
    this.statusControl.markAllAsTouched();

    if (this.statusControl.valid) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: `Update appointment status to ${this.statusControl.getRawValue()}`,
          text: `Are you sure you want to update appointment status to ${this.statusControl.getRawValue()}? All of the data will be permanently updated. This action cannot be undone.`,
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

            status: this.statusControl.getRawValue() as string
          }).subscribe({
            next: res => {
              this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Success',
                  text: this.getUpdateStatusMessage(this.statusControl.getRawValue() as string, this.data.appointment.id),
                  status: Status.SUCCESS
                }
              }).afterClosed().subscribe(res => {
                this.dialogRef.close();
              })
            },
            error: err => {
              this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Error',
                  text: `Something went wrong when updating appointment status to ${this.statusControl.getRawValue()}`,
                  status: Status.ERROR
                }
              }).afterClosed().subscribe(res => {
                this.dialogRef.close();
              })
            }
          });
        }
      });
    }
  }

  completeAppointment() {
    this.dialog.open(CompleteAppointmentComponent, {
      data: {
        appointment: this.data.appointment
      }
    });
  }

  viewScreenshots(appointment_completion_images: AppointmentCompletionImage[]) {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        images: appointment_completion_images.map(image=> image.path)
      }
    });
  }
}
