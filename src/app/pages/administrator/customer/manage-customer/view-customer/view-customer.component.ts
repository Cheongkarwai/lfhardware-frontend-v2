import {Component, Inject, OnInit} from '@angular/core';
import {ProviderService} from "../../../../../core/service-provider/service-provider.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  ViewServiceProviderComponent
} from "../../../service-provider/manage-service-provider/view-service-provider/view-service-provider.component";
import {CustomerService} from "../../../../../core/customer/customer.service";
import {BehaviorSubject, map, Observable, startWith, switchMap} from "rxjs";
import {Customer} from "../../../../../core/customer/customer.interface";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";
import {Pageable, PageRequest} from "../../../../../core/page/pagination.interface";
import {Appointment} from "../../../../../core/appointment/appointment.interface";
import {BadgeComponent} from "../../../../../components/badge/badge.component";
import {LoadMoreButtonComponent} from "../../../../../components/load-more-button/load-more-button.component";

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [
    AsyncPipe,
    LoadingSpinnerComponent,
    NgForOf,
    NgIf,
    DatePipe,
    BadgeComponent,
    LoadMoreButtonComponent
  ],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.scss'
})
export class ViewCustomerComponent implements OnInit {

  customerDetails$!: Observable<Customer>;
  customerAppointments$!: Observable<Pageable<Appointment>>;
  appointmentPageRequest: PageRequest = {
    page: 0,
    page_size: 5,
    sort: 'bookingDatetime,DESC',
    search: {
      keyword: '',
      attributes: []
    }
  };
  pagination$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.appointmentPageRequest);
  appointments: Appointment[] = [];

  constructor(private customerService: CustomerService,
              @Inject(MAT_DIALOG_DATA) public data: { customerId: string },
              private dialogRef: MatDialogRef<ViewCustomerComponent>) {
  }

  ngOnInit(): void {
    this.customerDetails$ = this.customerService.findById(this.data.customerId);
    this.customerAppointments$ = this.pagination$.pipe(startWith(this.appointmentPageRequest),
      switchMap(pageRequest => this.customerService.findCustomerAppointmentsById(this.appointmentPageRequest, this.data.customerId)
        .pipe(map(appointmentPageable=>{
          this.appointments.push(...appointmentPageable.items);
          return appointmentPageable;
        }))));
  }

  closeModal() {
    this.dialogRef.close();
  }

  loadMoreAppointments(has_next_page: boolean) {
    if (has_next_page) {
      this.appointmentPageRequest.page++;
      this.pagination$.next(this.appointmentPageRequest);
    }
  }
}
