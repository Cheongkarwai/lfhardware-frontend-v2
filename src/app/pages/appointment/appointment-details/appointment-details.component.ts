import {Component} from '@angular/core';
import {BreadcrumbComponent} from "../../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppointmentService} from "../../../core/appointment/appointment.service";
import {CustomerService} from "../../../core/customer/customer.service";
import {Observable} from "rxjs";
import {Appointment, AppointmentCompletionImage} from "../../../core/appointment/appointment.interface";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {ImagePreviewComponent} from "../../service-provider/manage-appointment/image-preview/image-preview.component";
import {MatDialog} from "@angular/material/dialog";
import {
  AppointmentProgressBarComponent
} from "../../../components/appointment-progress-bar/appointment-progress-bar.component";

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    AppointmentProgressBarComponent
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
              private dialog: MatDialog) {
    this.serviceId = Number(this.activatedRoute.snapshot.params['serviceId']);
    this.serviceProviderId = this.activatedRoute.snapshot.params['serviceProviderId'];
    this.createdAt = this.activatedRoute.snapshot.params['createdAt'];

    this.appointment$ = this.customerService.findCurrentCustomerAppointmentById(this.serviceId, this.serviceProviderId, this.createdAt);
  }

  viewScreenshots(appointment_completion_images: AppointmentCompletionImage[]) {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        images: appointment_completion_images.map(image=> image.path)
      }
    });
  }
}
