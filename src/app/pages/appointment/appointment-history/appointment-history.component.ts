import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "../../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {AppointmentService} from "../../../core/appointment/appointment.service";
import {map, Observable, startWith, switchMap} from "rxjs";
import {Pageable, PageRequest} from "../../../core/page/pagination.interface";
import {Appointment} from "../../../core/appointment/appointment.interface";
import {CustomerService} from "../../../core/customer/customer.service";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {RouterLink} from "@angular/router";
import {BadgeComponent} from "../../../components/badge/badge.component";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {AppointmentDetailsComponent} from "../appointment-details/appointment-details.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../../core/dialog/toast.service";
import {AppointmentReviewComponent} from "./appointment-review/appointment-review.component";

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    LoadingSpinnerComponent,
    RouterLink,
    BadgeComponent
  ],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss'
})
export class AppointmentHistoryComponent implements OnInit {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Appointment History',
      routerLink: 'appointment-history'
    },
  ];

  appointments$!: Observable<Pageable<Appointment>>;
  pageRequest: PageRequest = {
    page: 0,
    page_size: 6,
    sort: '',
    search: {
      attributes: [],
      keyword: ''
    }
  }

  appointmentMenus: { hidden: boolean }[] = [];

  constructor(private customerService: CustomerService,
              private providerService: ProviderService,
              private dialog: MatDialog,
              private appointmentService: AppointmentService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.appointments$ = this.appointmentService.refreshAppointment$.pipe(startWith(''), switchMap(e => {
      return this.customerService.findCurrentCustomerAppointments(this.pageRequest, null, ['COMPLETED', 'REFUNDED', 'CANCELLED'])
        .pipe(map(appointmentPageable => {
          appointmentPageable.items.forEach((item, index) => this.appointmentMenus[index] = {hidden: true});
          return appointmentPageable;
        }));
    }))
  }

  openMenu(i: number) {
    this.appointmentMenus.forEach((menu, index) => {
      if (index === i) {
        this.appointmentMenus[i].hidden = false;
      } else {
        menu.hidden = true
      }
    });
  }


  viewDetails(appointment: Appointment) {
    this.dialog.open(AppointmentDetailsComponent, {
      data: {
        serviceId: appointment.service.id,
        serviceProviderId: appointment.service_provider.id,
        createdAt: appointment.created_at
      },
      maxHeight: 600,
    });
  }

  viewReceipt(appointment: Appointment) {
    this.appointmentService.viewReceipt(appointment.service.id, appointment.service_provider.id, appointment.customer.id, appointment.created_at)
      .subscribe({
        next: res => window.open(res),
        error: err => {
          this.toastService.open('Something went wrong when opening receipt', 'error');
        }
      });
  }

  leaveReview(appointment: Appointment) {
    this.dialog.open(
      AppointmentReviewComponent, {
        data: {
          appointment: appointment
        }
      }
    );
  }
}
