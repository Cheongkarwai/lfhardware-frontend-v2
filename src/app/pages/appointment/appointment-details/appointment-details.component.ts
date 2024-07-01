import {Component, Inject} from '@angular/core';
import {BreadcrumbComponent} from "../../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppointmentService} from "../../../core/appointment/appointment.service";
import {CustomerService} from "../../../core/customer/customer.service";
import {Observable} from "rxjs";
import {Appointment, AppointmentCompletionImage} from "../../../core/appointment/appointment.interface";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {ImagePreviewComponent} from "../../service-provider/manage-appointment/image-preview/image-preview.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  AppointmentProgressBarComponent
} from "../../../components/appointment-progress-bar/appointment-progress-bar.component";
import {AppointmentTable} from "../../../core/appointment/appointment-table.interface";
import {BadgeComponent} from "../../../components/badge/badge.component";

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    AppointmentProgressBarComponent,
    BadgeComponent
  ],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})
export class AppointmentDetailsComponent {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Appointments',
      routerLink: ''
    },

  ];

  serviceId: number = 0;
  serviceProviderId: string = '';
  createdAt: string = '';


  appointment$: Observable<Appointment>;


  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<AppointmentDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { serviceId: number, serviceProviderId: string, createdAt: Date}) {
    this.serviceId = Number(this.activatedRoute.snapshot.params['serviceId']);
    this.serviceProviderId = this.activatedRoute.snapshot.params['serviceProviderId'];
    this.createdAt = this.activatedRoute.snapshot.params['createdAt'];

    this.appointment$ = this.customerService.findCurrentCustomerAppointmentById(this.data.serviceId, this.data.serviceProviderId, this.data.createdAt.toString());
  }

  viewScreenshots(appointment_completion_images: AppointmentCompletionImage[]) {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        images: appointment_completion_images.map(image=> image.path)
      }
    });
  }

  close(){
    this.dialogRef.close();
  }
}
