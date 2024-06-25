import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgApexchartsModule} from "ng-apexcharts";
import {TableModule} from "primeng/table";
import {TableComponent} from "../../../components/table/table.component";
import {TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {Pageable, PageRequest} from "../../../core/page/pagination.interface";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {AppointmentTable} from "../../../core/appointment/appointment-table.interface";
import {Filter} from "../../../components/table-header/table-header.component";
import {FormBuilder, FormControl} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, TableModule, TableComponent, TuiTablePaginationModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit, OnInit {

  chartOptions = {

    series: [],
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    legend: {
      show: false
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (value: string) {
          return value;
        }
      }
    },
  };

  //New Appointment
  appointmentChartOptions = {
    series: [],
    chart: {
      type: "bar",
      // height: "100%",
      // maxWidth: "100%",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadiusApplication: "end",
        borderRadius: 0,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {

      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };

  reviewsChartOption = {

    series: [0, 0, 0, 0, 0],
    colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694", '#E45332'],
    chart: {
      height: "86%",
      maxWidth: "100%",
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              label: "Total Reviews",
              fontFamily: "Inter, sans-serif",
              formatter: function (w: any) {
                const sum = w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0)
                return sum
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value: string) {
                return value
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        formatter: function (value: string) {
          return value
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value: string) {
          return value + "k"
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },

  };

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
      attributes: ['estimatedPrice', 'bookingDatetime', 'serviceProvider.id', 'service.id', 'customer.id', 'appointmentId.createdAt', 'isPaid', 'status'],
      keyword: ''
    },
    sort: 'createdAt,DESC',
  };

  appointmentPageable$!: Observable<Pageable<AppointmentTable>>;

  //Appointments Chart
  @ViewChild('toggleAppointmentMenuButton') toggleAppointmentButton!: ElementRef;
  @ViewChild('appointmentMenu') appointmentMenu!: ElementRef;
  isAppointmentMenuHidden: boolean = true;
  appointmentFilterControl: FormControl<number | null> = new FormControl<number | null>(7);
  totalAppointments: number = 0;
  appointmentChart!: ApexCharts;

  //Reviews Chart
  @ViewChild('toggleReviewMenuButton') toggleReviewButton!: ElementRef;
  @ViewChild('reviewMenu') reviewMenu!: ElementRef;
  isReviewMenuHidden: boolean = true;
  reviewFilterControl: FormControl<number | null> = new FormControl<number | null>(365);
  totalReviews: number = 0;
  reviewsChart!: ApexCharts;

  constructor(private fb: FormBuilder,
              private providerService: ProviderService,
              private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (e.target !== this.toggleAppointmentButton.nativeElement && e.target !== this.appointmentMenu.nativeElement) {
        this.isAppointmentMenuHidden = true;
      }
      if (e.target !== this.toggleReviewButton.nativeElement && e.target !== this.reviewMenu.nativeElement) {
        this.isReviewMenuHidden = true;
      }
    });
  }

  ngOnInit() {
    this.countProviderReviews();
    this.appointmentFilterControl.valueChanges.pipe(startWith(7))
      .subscribe({
        next: day => {
          this.appointmentChartOptions.series = [];
          this.countAppointments(day || 0);
        }
      })
    // this.countAppointments(this.appointmentFilterControl);
    //const appointmentChartLabel: never[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as never[];

    // @ts-ignore
    // this.chartOptions.series.push({
    //   name: "Total Appointments",
    //   data: appointmentChartData,
    //   color: "#7E3BF2",
    // });

    //this.chartOptions.xaxis.categories = appointmentChartLabel;

    this.findAppointments();
  }

  countAppointments(day: number) {
    combineLatest([this.providerService.countCurrentProviderAppointments('PENDING', day),
      this.providerService.countCurrentProviderAppointments('WORK_IN_PROGRESS', day),
      this.providerService.countCurrentProviderAppointments('COMPLETED', day),
      this.providerService.countCurrentProviderAppointments('CANCELLED', day),
      this.providerService.countCurrentProviderAppointments('REFUNDED', day),
      this.providerService.countCurrentProviderAppointments('REJECTED', day),
      this.providerService.countCurrentProviderAppointments('CONFIRMED', day),
      this.providerService.countCurrentProviderAppointments('REVIEW', day),
      this.providerService.countCurrentProviderAppointments('WORK_COMPLETED', day),
    ]).subscribe({
      next: ([pending, workInProgress, completed,
               cancelled, refunded, rejected,
               confirmed, reviewed, workCompleted]) => {

        const totalPending = pending.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalWorkInProgress = workInProgress.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalCompleted = completed.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalCancelled = cancelled.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalRefunded = refunded.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalRejected = rejected.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalConfirmed = confirmed.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalReviewed = reviewed.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);
        const totalWorkCompleted = workCompleted.map(appointment => appointment.total).reduce((partial, a) => partial + a, 0);

        this.totalAppointments = totalPending + totalWorkInProgress + totalCompleted + totalCancelled + totalRefunded + totalRejected
          + totalConfirmed + totalReviewed + totalWorkCompleted;

        //Pending
        this.appointmentChartOptions.series.push({
          name: 'Pending',
          color: "#d6d727",
          data: pending.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        this.appointmentChartOptions.series.push({
          name: 'Confirmed',
          color: "#391954",
          data: confirmed.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        //Work In Progress
        this.appointmentChartOptions.series.push({
          name: 'Work In Progress',
          color: "#1A56DB",
          data: workInProgress.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        //Work completed
        this.appointmentChartOptions.series.push({
          name: 'Work Completed',
          color: "#7ddc1f",
          data: workCompleted.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        this.appointmentChartOptions.series.push({
          name: 'Review By Administrator',
          color: "#8400ff",
          data: reviewed.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        this.appointmentChartOptions.series.push({
          name: 'Completed',
          color: "#00ff28",
          data: workInProgress.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        //Cancelled
        this.appointmentChartOptions.series.push({
          name: 'Cancelled',
          color: "#ff0303",
          data: cancelled.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        //Refunded
        this.appointmentChartOptions.series.push({
          name: 'Refunded',
          color: "#1A56DB",
          data: refunded.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        //Rejected
        this.appointmentChartOptions.series.push({
          name: 'Rejected',
          color: "#a73c5a",
          data: rejected.map(appointment => {
            return {
              x: appointment.day,
              y: appointment.total
            }
          })
        } as never);

        if (document.getElementById("appointment-chart") && typeof ApexCharts !== 'undefined') {
          this.appointmentChart  = new ApexCharts(document.getElementById("appointment-chart"), this.appointmentChartOptions);
          this.appointmentChart.render();
          this.appointmentChart.updateSeries(this.appointmentChartOptions.series)
            .then(res=>{
            });
        }
      }
    })
  }

  countProviderReviews() {
    this.providerService.countCurrentProviderReviews().subscribe({
      next: reviews => {
        this.totalReviews = reviews.map(review => review.total).reduce((acc, sum) => acc + sum, 0);
        this.reviewsChartOption.series = reviews.map(review => review.total);
        if (document.getElementById("reviews-chart") && typeof ApexCharts !== 'undefined') {
          this.reviewsChart  = new ApexCharts(document.getElementById("reviews-chart"), this.reviewsChartOption);
          this.reviewsChart.render();
          this.reviewsChart.updateSeries(this.reviewsChartOption.series)
            .then(res=>{
            });
        }
      }
    });

  }


  findAppointments() {
    this.appointmentPageable$ = this.providerService.findServiceProviderAppointments(this.pageRequest, [])
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
  }

  ngAfterViewInit() {
    if (document.getElementById("main-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("main-chart"), this.chartOptions);
      chart.render();
    }

    // if (document.getElementById("appointment-chart") && typeof ApexCharts !== 'undefined') {
    //   this.appointmentChart = new ApexCharts(document.getElementById("appointment-chart"), this.appointmentChartOptions);
    //   this.appointmentChart.render();
    // }
    // if (document.getElementById("reviews-chart") && typeof ApexCharts !== 'undefined') {
    //   const chart = new ApexCharts(document.getElementById("reviews-chart"), this.reviewsChartOption);
    //   chart.render();
    // }
  }

  toggleAppointmentDropdown() {
    this.isAppointmentMenuHidden = !this.isAppointmentMenuHidden;
  }

  setAppointmentFilter(day: number) {
    this.appointmentFilterControl.setValue(day);
  }

  toggleReviewMenu() {
    this.isReviewMenuHidden = !this.isReviewMenuHidden;
  }

  setReviewFilter(day: number) {
    this.reviewFilterControl.setValue(day);
  }
}
