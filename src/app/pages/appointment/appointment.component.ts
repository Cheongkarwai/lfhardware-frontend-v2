import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, map, Observable, ReplaySubject, startWith, switchMap, combineLatest} from "rxjs";
import {Appointment} from "../../core/appointment/appointment.interface";
import {Pageable, PageRequest} from "../../core/page/pagination.interface";
import {CommonModule} from "@angular/common";
import {AppointmentService} from "../../core/appointment/appointment.service";
import {CustomerService} from "../../core/customer/customer.service";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {BadgeComponent} from "../../components/badge/badge.component";
import {FilterCategory, FilterKeywordComponent} from "../../components/filter-keyword/filter-keyword.component";
import {FormControl} from "@angular/forms";
import {ButtonComponent} from "../../components/button/button.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../core/dialog/toast.service";
import {RouterModule} from "@angular/router";
import {ConfirmationDialogComponent} from "../../components/confirmation-dialog/confirmation-dialog.component";
import {CalendarComponent} from "../../components/calendar/calendar.component";
import {ProgressBarComponent} from "../../components/progress-bar/progress-bar.component";
import {CalendarViewComponent} from "./view-appointment/calendar-view/calendar-view.component";

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, BreadcrumbComponent, BadgeComponent, FilterKeywordComponent, ButtonComponent,
    RouterModule, CalendarComponent, ProgressBarComponent, CalendarViewComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent {

  // steps: string[] = ['Job accepted', 'Working on it', 'Job completion'];
  // appointment$!: Observable<Pageable<Appointment>>;
  // pageRequest: PageRequest = {
  //   page: 0,
  //   page_size: 5,
  //   sort: '',
  //   search: {
  //     keyword: '',
  //     attributes: []
  //   }
  // };
  // pagination$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.pageRequest);
  // breadcrumbItems = [
  //   {
  //     caption: 'Home',
  //     routerLink: '',
  //   },
  //   {
  //     caption: 'Appointments',
  //     routerLink: ''
  //   },
  //
  // ];
  // filterCategories: FilterCategory [] = [
  //   {
  //     title: 'Payment Status',
  //     controlType: 'checkbox',
  //     categoryItems: [
  //       {
  //         title: 'Paid',
  //         value: 'unpaid',
  //         control: new FormControl(false)
  //       },
  //       {
  //         title: 'Not Paid',
  //         value: 'paid',
  //         control: new FormControl(false)
  //       }
  //     ]
  //   }
  // ];
  // isLoadMoreBtnDisabled: boolean = false;
  // appointments: Appointment[] = [];
  // refresh$: ReplaySubject<string> = new ReplaySubject<string>(1);
  // layout: string = 'list';
  //
  // constructor(private customerService: CustomerService,
  //             private appointmentService: AppointmentService,
  //             private dialog: MatDialog,
  //             private toastService: ToastService) {
  // }
  //
  // ngOnInit() {
  //   this.appointment$ = combineLatest([this.refresh$.pipe(startWith('')), this.pagination$.pipe(startWith(this.pageRequest))])
  //     .pipe(switchMap(([refresh, pageRequest])=>{
  //       if(refresh){
  //         return this.customerService.findCurrentCustomerAppointments(pageRequest, null, []).pipe(map(pageable => {
  //           this.appointments.splice(pageRequest.page * pageRequest.page_size, pageable.items.length, ...pageable.items);
  //           return pageable;
  //         }));
  //       }
  //       return this.customerService.findCurrentCustomerAppointments(pageRequest, null, []).pipe(map(pageable => {
  //         this.appointments.push(...pageable.items);
  //         return pageable;
  //       }))
  //     }));
  // }
  //
  // changePage() {
  //   this.pagination$.next(this.pageRequest);
  // }
  //
  // loadMoreAppointments(hasNextPage: boolean) {
  //   if (hasNextPage) {
  //     this.pageRequest.page++;
  //     this.pagination$.next(this.pageRequest);
  //   }
  // }
  //
  // payAppointmentFee(appointment: Appointment) {
  //   this.appointmentService.payAppointmentFees(appointment).subscribe({
  //     next: res => window.open(res),
  //     error: err => {
  //       this.toastService.open('Something wrong during payment', 'error');
  //     }
  //   });
  //
  // }
  //
  // bookAppointment() {
  //   this.appointmentService.createAppointment({
  //     service_id: 1,
  //     service_provider_id: 'a17bfbe8-1e89-446f-8a24-011656327341',
  //     estimated_price: 100
  //   })
  //     .subscribe()
  // }
  //
  // cancel(appointment: Appointment) {
  //   this.dialog.open(ConfirmationDialogComponent, {
  //     data: {
  //       title: 'Mark appointment as cancelled',
  //       text: 'Are you sure you want to cancel your appointment ?',
  //       icon: 'warning'
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res) {
  //       this.appointmentService.updateAppointmentStatus({
  //         ids: [
  //           {
  //             customer_id: appointment.customer.id,
  //             service_id: appointment.service.id,
  //             created_at: appointment.created_at,
  //             service_provider_id: appointment.service_provider.id
  //           }
  //         ], status: 'CANCELLED'
  //       })
  //         .subscribe({
  //           next: res => {
  //             this.refresh$.next('completed');
  //             this.toastService.open('Cancelled appointment', 'success');
  //           },
  //           error: err => {
  //             this.toastService.open('Something wrong during cancellation', 'error');
  //           }
  //         })
  //     }
  //   });
  // }
  //
  // complete(appointment: Appointment) {
  //   this.dialog.open(ConfirmationDialogComponent, {
  //     data: {
  //       title: 'Mark appointment as completed',
  //       text: 'Are you sure you want to mark your appointment as completed ?',
  //       icon: 'warning'
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res) {
  //       this.appointmentService.updateAppointmentStatus({
  //         ids: [
  //           {
  //             customer_id: appointment.customer.id,
  //             service_id: appointment.service.id,
  //             created_at: appointment.created_at,
  //             service_provider_id: appointment.service_provider.id
  //           }
  //         ], status: 'COMPLETED'
  //       })
  //         .subscribe({
  //           next: res => {
  //             this.refresh$.next('completed');
  //             this.toastService.open('Mark appointment as completed', 'success');
  //           },
  //           error: err => {
  //             this.toastService.open('Something wrong during completion', 'error');
  //           }
  //         })
  //     }
  //   });
  // }
  //
  // changeLayout(layout: string) {
  //   this.layout = layout;
  // }
}
