import {Component, OnInit} from '@angular/core';
import {TableComponent} from "../../../../components/table/table.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AppointmentService} from "../../../../core/appointment/appointment.service";
import {BehaviorSubject, combineLatest, map, Observable, startWith, switchMap} from "rxjs";
import {Pageable, PageRequest} from "../../../../core/page/pagination.interface";
import {CommonModule} from "@angular/common";
import {AppointmentTable} from "../../../../core/appointment/appointment-table.interface";
import {MatDialog} from "@angular/material/dialog";
import {ViewAppointmentComponent} from "./view-appointment/view-appointment.component";
import {Filter} from "../../../../components/table-header/table-header.component";

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [
    TableComponent,
    TuiTablePaginationModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './manage-appointment.component.html',
  styleUrl: './manage-appointment.component.scss'
})
export class ManageAppointmentComponent implements OnInit {

  //Filters
  filters: Filter[] = [{
    title: 'Status',
    items: [
      {
        title: 'Pending',
        value: 'PENDING'
      },
      {
        title: 'Confirmed',
        value: 'CONFIRMED'
      },
      {
        title: 'Completed',
        value: 'COMPLETED'
      },
      {
        title: 'Reviewing By Admin',
        value: 'REVIEW'
      },
      {
        title: 'Cancelled',
        value: 'CANCELLED'
      },
      {
        title: 'Rejected',
        value: 'REJECTED'
      },
      {
        title: 'Work In Progress',
        value: 'WORK_IN_PROGRESS'
      },
      {
        title: 'Work completed',
        value: 'WORK_COMPLETED'
      },
    ],
    type: 'checkbox',
    formArray: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false),
    new FormControl(false), new FormControl(false), new FormControl(false), new FormControl(false), new FormControl(false)])
  }];
  searchControl: FormControl<string | null> = new FormControl<string | null>('');

  size = 3;
  page = 0;

  pageRequest: PageRequest = {
    page: 0,
    page_size: 20,
    search: {
      attributes: ['estimatedPrice', 'bookingDatetime', 'serviceProvider.id','service.id', 'customer.id', 'appointmentId.createdAt', 'isPaid', 'status'],
      keyword: ''
    },
    sort: ''
  }

  columns = [
    {key: 'index', value: 'No'},
    {key: 'service_id', value: 'Service Id'},
    {key: 'service_provider_id', value: 'Service Provider Id'},
    {key: 'customer_id', value: 'Customer Id'},
    {key: 'created_at', value: 'Created At'},
    {key: 'booking_datetime', value: 'Booking Date Time'},
    {key: 'estimated_price', value: 'Estimated Price'},
    {key: 'is_paid', value: 'Paid'},
    {key: 'status', value: 'Status'}
  ];

  search = '';

  appointments$!: Observable<Pageable<AppointmentTable>>;
  pagination$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.pageRequest);

  constructor(private appointmentService: AppointmentService,
              private dialog: MatDialog,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.appointments$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.filters[0].formArray.valueChanges.pipe(startWith([])),
      this.appointmentService.refreshServiceProviderManageAppointment$.asObservable().pipe(startWith('')),
      this.pagination$.pipe(startWith(this.pageRequest))])
      .pipe(switchMap(([keyword, statusArray , refresh, page])=>{
        page.search.keyword = '';
        if (keyword) {
          page.search.keyword = keyword;
        }
        let status: string[] = [];
        for(let i = 0;i < statusArray.length; i ++){
          if(statusArray[i]){
            status.push(this.filters[0].items[i].value);
          }
        }
        return this.appointmentService.findAll(page, status)
          .pipe(map(appointmentPageable => {
            return {
              has_previous_page: appointmentPageable.has_previous_page,
              has_next_page: appointmentPageable.has_next_page,
              size: appointmentPageable.size,
              current_page: appointmentPageable.current_page,
              total_elements: appointmentPageable.total_elements,
              items: appointmentPageable.items.map((item, index) => {
                return {
                  id: item.id,
                  index: appointmentPageable.current_page * appointmentPageable.size + index + 1,
                  service_id: item.service.id,
                  customer_id: item.customer.id,
                  service_provider_id: item.service_provider.id,
                  created_at: item.created_at,
                  booking_datetime: item.booking_datetime,
                  estimated_price: item.estimated_price,
                  is_paid: item.is_paid,
                  status: item.status
                }
              })
            } as Pageable<AppointmentTable>
          }));
    }));
    // this.appointments$ = this.appointmentService.findAll(this.pageRequest)
    //   .pipe(map(appointmentPageable => {
    //     return {
    //       has_previous_page: appointmentPageable.has_previous_page,
    //       has_next_page: appointmentPageable.has_next_page,
    //       size: appointmentPageable.size,
    //       current_page: appointmentPageable.current_page,
    //       total_elements: appointmentPageable.total_elements,
    //       items: appointmentPageable.items.map((item, index) => {
    //         return {
    //           id: item.id,
    //           index: appointmentPageable.current_page * appointmentPageable.size + index + 1,
    //           service_id: item.service.id,
    //           customer_id: item.customer.id,
    //           service_provider_id: item.service_provider.id,
    //           created_at: item.created_at,
    //           booking_datetime: item.booking_datetime,
    //           estimated_price: item.estimated_price,
    //           is_paid: item.is_paid,
    //           status: item.status
    //         }
    //       })
    //     } as Pageable<AppointmentTable>
    //   }));
  }

  openViewDialog(appointment: AppointmentTable) {
    this.dialog.open(ViewAppointmentComponent, {
      data: {
        appointment: appointment
      },
      maxHeight: 500
    });
  }

  changePagination(event: TuiTablePagination) {
    this.pageRequest.page = event.page;
    this.pageRequest.page_size = event.size;
    this.pagination$.next(this.pageRequest);
  }
}
