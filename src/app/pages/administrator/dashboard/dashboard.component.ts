import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  forkJoin,
  map,
  Observable, of,
  pairwise,
  startWith,
  switchMap,
  throttleTime
} from "rxjs";
import {CdkScrollableModule, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {TuiSvgModule} from "@taiga-ui/core";
import {CountUpDirective} from "../../../core/directive/count-up.directive";
import {TuiMarkerIconModule} from "@taiga-ui/kit";
import {BarChartComponent} from "../../../components/bar-chart/bar-chart.component";
import {TableComponent} from "../../../components/table/table.component";
import {Pageable} from "../../../core/page/pagination.interface";
import {User} from "../../../core/user/user.interface";
import {UserService} from "../../../core/user/user.service";
import {UserPageRequest} from "../../../core/user/user-page-request.interface";
import {UserAccount} from "../../../core/user/user-account.interface";
import {UserTable} from "../../../core/user/user-table.interface";
import {CommonModule} from "@angular/common";
import {OrderService} from "../../../core/order/order.service";
import {PaymentService} from "../../../core/payment/payment.service";
import {TransactionService} from "../../../core/transaction/transaction.service";
import {ReportService} from "../../../core/report/report.service";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle, NgApexchartsModule
} from "ng-apexcharts";
import {ApexOptions} from 'apexcharts';
import {ChartOptions} from "chart.js";
import {FormControl} from "@angular/forms";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {AppointmentService} from "../../../core/appointment/appointment.service";
import {CustomerService} from "../../../core/customer/customer.service";

// export type ChartOption = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   title: ApexTitleSubtitle;
// };

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CountUpDirective, TuiMarkerIconModule, BarChartComponent, ScrollingModule, TableComponent, CommonModule, NgApexchartsModule],
  standalone: true
})
export class DashboardComponent implements OnInit, AfterViewInit {

  labels = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September',
    'October', 'November', 'December'];

  @ViewChild(CdkVirtualScrollViewport) scroller!: CdkVirtualScrollViewport;

  userPageable$!: Observable<Pageable<UserTable>>

  columns = [
    {key: 'id', value: 'ID'},
    {key: 'username', value: 'Username', searchKey: ''},
    {key: 'email', value: 'Email address', searchKey: ''},
    {key: 'first_name', value: 'First Name', searchKey: ''},
    {key: 'last_name', value: 'Last Name', searchKey: ''},
    {key: 'email_verified', value: 'Email Verified', searchKey: ''},
  ];

  pageRequest: UserPageRequest = {
    page: 0,
    page_size: 6,
    sort: 'createdAt,DESC',
    search: {
      attributes: [],
      keyword: ''
    }
  };

  pagination$: BehaviorSubject<UserPageRequest> = new BehaviorSubject<UserPageRequest>(this.pageRequest);

  count$!: Observable<[number, number, number]>

  statistic$!: Observable<number[]>;

  @ViewChild("chart") chart!: ChartComponent;
  serviceProviderChartOption = {
    series: [],
    chart: {
      maxHeight: "60%",
      // height: "60%",
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
      show: false,
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

  appointmentChartOption = {
    series: [],
    chart: {
      maxHeight: "60%",
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
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    xaxis: {
      categories: [''],
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

  customerChartOption = {
    series: [],
    chart: {
      maxHeight: "60%",
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
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    xaxis: {
      categories: [''],
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

  expensesOption = {
    colors: ["#1A56DB", "#FDBA8C"],
    series: [
      {
        name: "Organic",
        color: "#1A56DB",
        data: [
          {x: "Mon", y: 231},
          {x: "Tue", y: 122},
          {x: "Wed", y: 63},
          {x: "Thu", y: 421},
          {x: "Fri", y: 122},
          {x: "Sat", y: 323},
          {x: "Sun", y: 111},
        ],
      },
      {
        name: "Social media",
        color: "#FDBA8C",
        data: [
          {x: "Mon", y: 232},
          {x: "Tue", y: 113},
          {x: "Wed", y: 341},
          {x: "Thu", y: 224},
          {x: "Fri", y: 522},
          {x: "Sat", y: 411},
          {x: "Sun", y: 243},
        ],
      },
    ],
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
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
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
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  }

  trafficChartOption = () => {
    return {
      series: [35.1, 23.5, 2.4, 5.4],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        // height: "100%",
        // maxWidth: "100%",
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
                label: "Unique visitors",
                fontFamily: "Inter, sans-serif",
                formatter: function (w: any) {
                  const sum = w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
                  return '$' + sum + 'k'
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value: string) {
                  return value + "k"
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
      labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value: string) {
            return value + "k"
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
    }
  }

  salesOption = {
// add data series via arrays, learn more here: https://apexcharts.com/docs/series/
    series: [
      // {
      //   name: "Developer Edition",
      //   data: [1500, 1418, 1456, 1526, 1356, 1256],
      //   color: "#1A56DB",
      // },
      // {
      //   name: "Designer Edition",
      //   data: [643, 413, 765, 412, 1423, 1731],
      //   color: "#7E3BF2",
      // },
    ],
    chart: {
      maxHeight: "60%",
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
      show: false,
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
          return '$' + value;
        }
      }
    },
  }


  totalOrders: number = 0;
  orderSalesFilterControl: FormControl<number | null> = new FormControl<number | null>(7);

  totalRegisteredServiceProvider: number = 0;
  totalRegisteredServiceProviderFilterControl: FormControl<number | null> = new FormControl<number | null>(7);
  @ViewChild('toggleServiceProviderMenuButton') toggleServiceProviderButton!: ElementRef;
  @ViewChild('serviceProviderMenu') serviceProviderMenu!: ElementRef;
  isServiceProviderMenuHidden: boolean = true;

  totalAppointments: number = 0;
  totalAppointmentsFilterControl: FormControl<number | null> = new FormControl<number | null>(7);
  @ViewChild('toggleAppointmentProviderMenuButton') toggleAppointmentButton!: ElementRef;
  @ViewChild('appointmentMenu') appointmentMenu!: ElementRef;
  isAppointmentMenuHidden: boolean = true;

  totalCustomers: number = 0;
  totalCustomersFilterControl: FormControl<number | null> = new FormControl<number | null>(7);
  @ViewChild('toggleCustomerMenuButton') toggleCustomerButton!: ElementRef;
  @ViewChild('customerMenu') customerMenu!: ElementRef;
  isCustomerMenuHidden: boolean = true;

  constructor(private httpClient: HttpClient, private ngZone: NgZone,
              private userService: UserService, private orderService: OrderService,
              private transactionService: TransactionService,
              private reportService: ReportService,
              private providerService: ProviderService,
              private customerService: CustomerService,
              private appointmentService: AppointmentService,
              private renderer: Renderer2
  ) {


    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (e.target !== this.toggleServiceProviderButton.nativeElement && e.target !== this.serviceProviderMenu.nativeElement) {
        this.isServiceProviderMenuHidden = true;
      }
      if (e.target !== this.toggleAppointmentButton.nativeElement && e.target !== this.appointmentMenu.nativeElement) {
        this.isAppointmentMenuHidden = true;
      }

      if (e.target !== this.toggleCustomerButton.nativeElement && e.target !== this.customerMenu.nativeElement) {
        this.isCustomerMenuHidden = true;
      }
    });
  }

  ngOnInit(): void {
    this.countSales();
    this.totalAppointmentsFilterControl.valueChanges.pipe(startWith(7)).subscribe({
      next: day => {
        this.countAppointments(day as number);
      }
    });
    this.totalRegisteredServiceProviderFilterControl.valueChanges.pipe(startWith(7)).subscribe({
      next: day => {
        this.countServiceProvider(day as number);
      }
    });

    this.totalCustomersFilterControl.valueChanges.pipe(startWith(7)).subscribe({
      next: day => {
        this.countCustomers(day as number);
      }
    })

    this.findMonthlySales();
    this.findUsers();
  }

  findMonthlySales() {
    this.statistic$ = this.reportService.findMonthlySales().pipe(map((monthlySales) => {
      const statistic: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < monthlySales.length; i++) {
        statistic[Number(monthlySales[i].month)] = monthlySales[i].total;
      }
      return statistic;
    }), catchError(err => {
      return of([]);
    }));
  }

  findUsers() {
    this.userPageable$ = this.pagination$.pipe(startWith(this.pageRequest), switchMap(pageRequest => {
      return this.userService.findAll(pageRequest)
        .pipe(map(users => {
          return {
            current_page: users.current_page,
            size: users.size,
            total_elements: users.total_elements,
            has_next_page: users.has_next_page,
            has_previous_page: users.has_previous_page,
            items: users.items.map(user => {
              return {
                id: user.id,
                username: user.username,
                email: user.email,
                email_verified: user.email_verified,
                first_name: user.first_name,
                last_name: user.last_name,
              } as UserTable;
            })
          } as Pageable<UserTable>
        }));

    }), catchError(err => {
      return of({
        items: [],
        size: 0,
        current_page: 0,
        total_elements: 0,
        has_next_page: false,
        has_previous_page: false
      });
    }))
  }

  countCustomers(day: number) {
    this.customerService.count(day).subscribe({
      next: customers => {

        this.totalCustomers = customers.map(e => e.total).reduce((accumulator, curr) => accumulator + curr, 0);

        this.customerChartOption.series = [{
          name: "Registered Customer",
          data: customers.map(customer => customer.total),
          color: "#1e40af",
        }] as never[];
        this.customerChartOption.xaxis.categories = customers.map(customer => customer.day);

        if (document.getElementById("customer-chart") && typeof ApexCharts !== 'undefined') {
          const chart = new ApexCharts(document.getElementById("customer-chart"), this.customerChartOption);
          chart.render();
          chart.updateSeries(this.customerChartOption.series);
        }
      }
    })
  }

  countAppointments(day: number) {
    forkJoin([
      this.appointmentService.count('PENDING', day),
      this.appointmentService.count('CONFIRMED', day),
      this.appointmentService.count('WORK_IN_PROGRESS', day),
      this.appointmentService.count('WORK_COMPLETED', day),
      this.appointmentService.count('REVIEW', day),
      this.appointmentService.count('COMPLETED', day),
      this.appointmentService.count('CANCELLED', day),
      this.appointmentService.count('REFUNDED', day),
      this.appointmentService.count('REJECTED', day)

    ]).subscribe({
      next: ([pending, confirmed, workInProgress,
               workCompleted, reviewed, completed, cancelled, refunded, rejected]) => {

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

        this.appointmentChartOption.series = [];

        this.appointmentChartOption.series = [{
          name: "Pending",
          data: pending.map(p => p.total),
          color: "#d6d727",
        }] as never;

        this.appointmentChartOption.series.push({
          name: "Confirmed",
          data: confirmed.map(p => p.total),
          color: "#391954",
        } as never);

        this.appointmentChartOption.series.push({
          name: "Work In Progress",
          data: workInProgress.map(p => p.total),
          color: "#1A56DB",
        } as never);

        this.appointmentChartOption.series.push({
          name: "Work Completed",
          data: workCompleted.map(p => p.total),
          color: "#7E3BF2",
        } as never);

        this.appointmentChartOption.series.push({
          name: "Reviewed",
          data: reviewed.map(p => p.total),
          color: "#7ddc1f",
        } as never);

        this.appointmentChartOption.series.push({
          name: "Completed Appointment",
          data: completed.map(p => p.total),
          color: "#00ff28",
        } as never);


        this.appointmentChartOption.series.push({
          name: "Cancelled Appointment",
          data: cancelled.map(p => p.total),
          color: "#ff0303",
        } as never);

        this.appointmentChartOption.series.push({
          name: "Refunded Appointment",
          data: refunded.map(p => p.total),
          color: "#1A56DB",
        } as never);

        this.appointmentChartOption.series.push({
          name: "Rejected Appointment",
          data: rejected.map(p => p.total),
          color: "#a73c5a",
        } as never);
        this.appointmentChartOption.xaxis.categories = pending.map(appointment => appointment.day);

        if (document.getElementById("appointment-chart") && typeof ApexCharts !== 'undefined') {
          const chart = new ApexCharts(document.getElementById("appointment-chart"), this.appointmentChartOption);
          chart.render();
          chart.updateSeries(this.appointmentChartOption.series);
        }
      }

    })
  }

  countServiceProvider(day: number) {
    this.providerService.countServiceProvider(day)
      .subscribe({
        next: serviceProviders => {
          this.totalRegisteredServiceProvider = serviceProviders.map(e => e.total).reduce((accumulator, curr) => accumulator + curr, 0);

          this.serviceProviderChartOption.series = [{
            name: "Registered Service Provider",
            data: serviceProviders.map(serviceProvider => serviceProvider.total),
            color: "#7E3BF2",
          }] as never[];
          this.serviceProviderChartOption.xaxis.categories = serviceProviders.map(serviceProvider => serviceProvider.day);

          if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(document.getElementById("area-chart"), this.serviceProviderChartOption);
            chart.render();
            chart.updateSeries(this.serviceProviderChartOption.series);
          }
        }
      });
  }

  countSales() {
    this.orderService.countDailySales(7).subscribe(dailyOrders => {
      const orderChartData: number[] = [];
      const orderChartLabels: never[] = [];
      for (let i = 0; i < dailyOrders.length; i++) {
        orderChartData[i] = dailyOrders[i].total;
        orderChartLabels[i] = dailyOrders[i].day;
      }

      this.totalOrders = dailyOrders.map(e => e.total).reduce((accumulator, curr) => accumulator + curr, 0);
      this.salesOption.xaxis.categories = orderChartLabels;
      // @ts-ignore
      this.salesOption.series.push({
        name: "Orders",
        data: orderChartData,
        color: "#db2777",
      });
    });
  }

  ngAfterViewInit() {
    if (document.getElementById("traffic-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("traffic-chart"), this.trafficChartOption());
      chart.render();
    }

    if (document.getElementById("sales-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("sales-chart"), this.salesOption);
      chart.render();
    }
  }


  toggleServiceProviderMenu() {
    this.isServiceProviderMenuHidden = !this.isServiceProviderMenuHidden;
  }

  setServiceProviderFilter(day: number) {
    this.totalRegisteredServiceProviderFilterControl.setValue(day);
  }

  setAppointmentFilter(day: number) {
    this.totalAppointmentsFilterControl.setValue(day);
  }

  toggleAppointmentMenu() {
    this.isAppointmentMenuHidden = !this.isAppointmentMenuHidden;
  }

  toggleCustomerMenu() {
    this.isCustomerMenuHidden = !this.isCustomerMenuHidden;
  }

  setCustomerFilter(day: number) {
    this.totalCustomersFilterControl.setValue(day);
  }
}
