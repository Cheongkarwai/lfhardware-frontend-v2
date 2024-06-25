import {AfterViewInit, Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../../components/button/button.component";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../../components/table/table.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {Pageable, PageRequest} from "../../../core/page/pagination.interface";
import {BehaviorSubject, combineLatest, map, Observable, ReplaySubject, startWith, switchMap} from "rxjs";
import {Appointment} from "../../../core/appointment/appointment.interface";
import {AppointmentService} from "../../../core/appointment/appointment.service";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {AppointmentTable} from "../../../core/appointment/appointment-table.interface";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent, Status} from "../../../components/alert-dialog/alert-dialog.component";
import {ConfirmationDialogComponent} from "../../../components/confirmation-dialog/confirmation-dialog.component";
import {
  ViewOrderDetailsComponent
} from "../../administrator/order/manage-order/view-order-details/view-order-details.component";
import {initFlowbite} from "flowbite";
import {ViewAppointmentComponent} from "./view-appointment/view-appointment.component";
import {ToastService} from "../../../core/dialog/toast.service";
import {Filter} from "../../../components/table-header/table-header.component";
import {CompleteAppointmentComponent} from "./complete-appointment/complete-appointment.component";

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [
    ButtonComponent,
    LoadingSpinnerComponent,
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    TuiTablePaginationModule,
  ],
  templateUrl: './manage-appointment.component.html',
  styleUrl: './manage-appointment.component.scss'
})
export class ManageAppointmentComponent implements OnInit, AfterViewInit {

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

  pageRequest: PageRequest = {
    page: 0,
    page_size: 5,
    search: {
      attributes: ['estimatedPrice', 'bookingDatetime', 'serviceProvider.id','service.id', 'customer.id', 'appointmentId.createdAt', 'isPaid', 'status'],
      keyword: ''
    },
    sort: 'createdAt,DESC',
  };

  appointmentPageable!: Observable<Pageable<AppointmentTable>>;
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

  pagination$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.pageRequest);
  refresh$: ReplaySubject<void> = new ReplaySubject<void>(1);

  @ViewChild(TableComponent) table!: TableComponent;

  constructor(private appointmentService: AppointmentService,
              private providerService: ProviderService,
              private dialog: MatDialog,
              @Inject(Injector) private readonly injector: Injector,
              private toastService: ToastService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.appointmentPageable = combineLatest([
      this.pagination$.pipe(startWith(this.pageRequest)),
      this.searchControl.valueChanges.pipe(startWith('')),
      this.refresh$.pipe(startWith('')),
      this.filters[0].formArray.valueChanges.pipe(startWith([]))
    ])
      .pipe(
        switchMap(([page, keyword, refresh, statusArr]) => {
          if (keyword) {
            page.search.keyword = keyword;
            page.search.attributes = ['estimatedPrice'];
          }
          let statuses: string[] = [];
          for(let i = 0;i < statusArr.length; i ++){
            if(statusArr[i]){
              statuses.push(this.filters[0].items[i].value);
            }
          }
          return this.providerService.findServiceProviderAppointments(page, statuses)
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
            }))
        }))
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  handleContextMenu(event: any) {
    switch (event.action) {
      case 'View Order Details':
        this.dialog.open(ViewOrderDetailsComponent,
          {
            data: event.data.id,
          })
        break;
    }
  }


  changePagination(event: TuiTablePagination) {
    this.pageRequest.page = event.page;
    this.pageRequest.page_size = event.size;
    this.pagination$.next(this.pageRequest);
  }


  edit($event: any) {

  }

  delete() {
    const isAtleastOneCheckboxChecked = this.table.checkboxFormArray.getRawValue().some(value => value)
    if (isAtleastOneCheckboxChecked) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Mark appointment as cancelled',
          text: 'Are you sure you want to update appointment status to cancelled? All of the data will be permanently updated. This action cannot be undone.',
          icon: 'error'
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          const filteredData = this.table.data.items.filter((item: any, index: number) => this.table.checkboxFormArray.getRawValue()[index]);
          this.appointmentService.updateAppointmentStatus({
            ids: filteredData.map((data: AppointmentTable) => {
              return {
                customer_id: data.customer_id,
                service_id: data.service_id,
                created_at: data.created_at,
                service_provider_id: data.service_provider_id,
              }
            }),
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
                this.refresh$.next();
                this.table.uncheckAll();
              })
            },
            error: err => {

            }
          });
        }
      })
    }
  }

  complete() {
    const isAtleastOneCheckboxChecked = this.table.checkboxFormArray.getRawValue().some(value => value)
    if (isAtleastOneCheckboxChecked) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Mark appointment as completed',
          text: 'Are you sure you want to update appointment status to completed? All of the data will be permanently updated. This action cannot be undone.',
          icon: 'error'
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          const filteredData = this.table.data.items.filter((item: any, index: number) => this.table.checkboxFormArray.getRawValue()[index]);
          this.appointmentService.updateAppointmentStatus({
            ids: filteredData.map((data: AppointmentTable) => {
              return {
                customer_id: data.customer_id,
                service_id: data.service_id,
                created_at: data.created_at,
                service_provider_id: data.service_provider_id,
              }
            }),
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
                this.refresh$.next();
                this.table.uncheckAll();
              })
            },
            error: err => {

            }
          });
        }
      })
    } else {
      this.toastService.open('Please select atleast one appointment', 'ERROR')
    }
  }

  openViewDialog(appointment: Appointment) {
    this.dialog.open(ViewAppointmentComponent, {
      data: {
        appointment: appointment
      },
      maxWidth: 600,
      maxHeight: 600
    });
  }

  // cancelAppointment(appointment: AppointmentTable) {
  //   this.dialog.open(ConfirmationDialogComponent, {
  //     data: {
  //       title: 'Mark appointment as cancelled',
  //       text: 'Are you sure you want to update appointment status to cancelled? All of the data will be permanently updated. This action cannot be undone.',
  //       icon: 'error'
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res) {
  //       this.appointmentService.updateAppointmentStatus({
  //         ids: [{
  //           customer_id: appointment.customer_id,
  //           service_id: appointment.service_id,
  //           created_at: appointment.created_at,
  //           service_provider_id: appointment.service_provider_id,
  //         }],
  //         status: 'CANCELLED'
  //       }).subscribe({
  //         next: res => {
  //           this.dialog.open(AlertDialogComponent, {
  //             data: {
  //               title: 'Success',
  //               text: "Appointment status is updated",
  //               status: Status.SUCCESS
  //             }
  //           }).afterClosed().subscribe(res => {
  //             this.refresh$.next();
  //           })
  //         },
  //         error: err => {
  //
  //         }
  //       });
  //     }
  //   });
  // }
  //
  // completeAppointment(appointment: AppointmentTable) {
  //   console.log(appointment);
  //   this.dialog.open(ConfirmationDialogComponent, {
  //     data: {
  //       title: 'Mark appointment as completed',
  //       text: 'Are you sure you want to update appointment status to completed? All of the data will be permanently updated. This action cannot be undone.',
  //       icon: 'error'
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res) {
  //       this.appointmentService.updateAppointmentStatus({
  //         ids: [{
  //           customer_id: appointment.customer_id,
  //           service_id: appointment.service_id,
  //           created_at: appointment.created_at,
  //           service_provider_id: appointment.service_provider_id,
  //         }],
  //         status: 'COMPLETED'
  //       }).subscribe({
  //         next: res => {
  //           this.dialog.open(AlertDialogComponent, {
  //             data: {
  //               title: 'Success',
  //               text: "Appointment status is updated",
  //               status: Status.SUCCESS
  //             }
  //           }).afterClosed().subscribe(res => {
  //             this.refresh$.next();
  //           });
  //         },
  //         error: err => {
  //           this.dialog.open(AlertDialogComponent, {
  //             data: {
  //               title: 'Update Appointment',
  //               text: "Something went wrong when updating appointment",
  //               status: Status.ERROR
  //             }
  //           }).afterClosed().subscribe(res => {
  //             this.refresh$.next();
  //             this.table.uncheckAll();
  //           })
  //         }
  //       });
  //     }
  //   });
  // }
  openCompleteDialog(appointment: Appointment) {
    this.dialog.open(CompleteAppointmentComponent, {
      data: {
        appointment: appointment
      }
    });
  }
}
