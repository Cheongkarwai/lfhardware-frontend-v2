import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, filter, forkJoin, map, Observable, pairwise, startWith, switchMap, throttleTime} from "rxjs";
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

  // appointments$ = new Observable<Appointment[]>();
  // appointmentsGroupByMonth$ = new Observable<AppointmentCountByMonth[]>();
  // totalAppointment$ = new Observable<number>();
  // months$ = new BehaviorSubject<string[]>(["January","February","March","April","May","Jun","July","August","September","November","December"]);
  @ViewChild(CdkVirtualScrollViewport) scroller!: CdkVirtualScrollViewport;

  userPageable$: Observable<Pageable<UserTable>>

  columns = [
    // {key:'no',value:'No'},
    {key: 'username', value: 'Username', searchKey: ''},
    {key: 'email_address', value: 'Email address', searchKey: ''},
    {key: 'phone_number', value: 'Contact Number', searchKey: ''},
    {key: 'role', value: 'Role', searchKey: ''},
    {key: 'address_line_1', value: 'Address Line 1', searchKey: ''},
    {key: 'address_line_2', value: 'Address Line 2', searchKey: ''},
    {key: 'state', value: 'State', searchKey: ''},
    {key: 'city', value: 'City', searchKey: ''},
    {key: 'zipcode', value: 'Zipcode', searchKey: ''}
    // {key:'active_status',value:'Active Status'},
    // {key:'last_login',value:'Last Login'}
  ];

  pageRequest: UserPageRequest = {
    page: 0,
    page_size: 6,
    sort: 'createdAt,DESC',
    search: {
      attributes : [],
      keyword : ''
    }
  };

  pagination$: BehaviorSubject<UserPageRequest> = new BehaviorSubject<UserPageRequest>(this.pageRequest);

  count$: Observable<[number, number, number]>

  statistic$: Observable<number[]>;

  @ViewChild("chart") chart!: ChartComponent;
  chartOptions = {
    series: [

    ],
    chart: {
      // height: "100%",
      // maxWidth: "100%",
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
        formatter: function (value:string) {
          return  value;
        }
      }
    },
  };

  expensesOption =  {
    colors: ["#1A56DB", "#FDBA8C"],
    series: [
      {
        name: "Organic",
        color: "#1A56DB",
        data: [
          { x: "Mon", y: 231 },
          { x: "Tue", y: 122 },
          { x: "Wed", y: 63 },
          { x: "Thu", y: 421 },
          { x: "Fri", y: 122 },
          { x: "Sat", y: 323 },
          { x: "Sun", y: 111 },
        ],
      },
      {
        name: "Social media",
        color: "#FDBA8C",
        data: [
          { x: "Mon", y: 232 },
          { x: "Tue", y: 113 },
          { x: "Wed", y: 341 },
          { x: "Thu", y: 224 },
          { x: "Fri", y: 522 },
          { x: "Sat", y: 411 },
          { x: "Sun", y: 243 },
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
                formatter: function (w:any) {
                  const sum = w.globals.seriesTotals.reduce((a:any, b:any) => {
                    return a + b
                  }, 0)
                  return '$' + sum + 'k'
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value:string) {
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
          formatter: function (value:string) {
            return value + "k"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value:string) {
            return value  + "k"
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
      // height: "80%",
      // maxWidth: "100%",
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
        formatter: function (value:string) {
          return '$' + value;
        }
      }
    },
  }

  totalRegisteredUser: number = 0;
  totalOrders: number = 0;

  constructor(private httpClient: HttpClient, private ngZone: NgZone,
              private userService: UserService, private orderService: OrderService,
              private transactionService: TransactionService,
              private reportService: ReportService
  ) {

    this.userService.countDailyUser(7).pipe(map(dailyUsers=>{

      const userChartData: number[] = [];
      const userChartLabels: never[] = [];
      for(let i = 0; i < dailyUsers.length; i++){
        userChartData[i] = dailyUsers[i].total;
        userChartLabels[i] = dailyUsers[i].day;
      }

      this.totalRegisteredUser = dailyUsers.map(e=>e.total).reduce((accumulator,curr)=> accumulator + curr, 0);

      // @ts-ignore
      this.chartOptions.series.push({
        name: "Registered User",
        data: userChartData,
        color: "#7E3BF2",
      });

      this.chartOptions.xaxis.categories = userChartLabels;

    })).subscribe(res=>console.log(res));

    this.orderService.countDailySales(7).pipe(map(dailyOrders=>{

      const orderChartData: number[] = [];
      const orderChartLabels: never[] = [];
      for(let i = 0; i < dailyOrders.length; i++){
        orderChartData[i] = dailyOrders[i].total;
        orderChartLabels[i] = dailyOrders[i].day;
      }

      this.totalOrders = dailyOrders.map(e=>e.total).reduce((accumulator,curr)=> accumulator + curr, 0);

      // @ts-ignore
      this.salesOption.series.push({
        name: "Orders",
        data: orderChartData,
        color: "#7E3BF2",
      });

      this.salesOption.xaxis.categories = orderChartLabels;

    })).subscribe(res=>console.log(res));

    this.statistic$ = this.reportService.findMonthlySales().pipe(map((monthlySales) => {
      const statistic: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < monthlySales.length; i++) {
        statistic[Number(monthlySales[i].month)] = monthlySales[i].total;
      }
      return statistic;
    }));

    this.count$ = forkJoin([this.userService.count(), this.orderService.count(), this.transactionService.count()]);
    this.userPageable$ = this.pagination$.pipe(startWith(this.pageRequest), switchMap(pageRequest => {
      return userService.findAll(pageRequest)
        .pipe(map(users => {
          return {
            current_page: users.current_page,
            size: users.size,
            total_elements: users.total_elements,
            has_next_page: users.has_next_page,
            has_previous_page: users.has_previous_page,
            items: users.items.map(user => {
              return {
                username: user.username,
                email_address: user.profile.email_address,
                phone_number: user.profile.phone_number,
                role: user.roles.map(role => role.name).join(', '),
                address_line_1: user.profile.address?.address_line_1,
                address_line_2: user.profile.address?.address_line_2,
                state: user.profile.address?.state || '',
                city: user.profile.address?.city || '',
                zipcode: user.profile.address?.zipcode || ''
              } as UserTable;
            })
          } as Pageable<UserTable>
        }));

    }))
  }

  ngAfterViewInit() {
    if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("area-chart"), this.chartOptions);
      chart.render();
    }
    if(document.getElementById("expenses-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("expenses-chart"), this.expensesOption);
      chart.render();
    }

    if (document.getElementById("traffic-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("traffic-chart"), this.trafficChartOption());
      chart.render();

      // Get all the checkboxes by their class name
      //const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]');

      // // Function to handle the checkbox change event
      // function handleCheckboxChange(event, chart) {
      //   const checkbox = event.target;
      //   if (checkbox.checked) {
      //     switch(checkbox.value) {
      //       case 'desktop':
      //         chart.updateSeries([15.1, 22.5, 4.4, 8.4]);
      //         break;
      //       case 'tablet':
      //         chart.updateSeries([25.1, 26.5, 1.4, 3.4]);
      //         break;
      //       case 'mobile':
      //         chart.updateSeries([45.1, 27.5, 8.4, 2.4]);
      //         break;
      //       default:
      //         chart.updateSeries([55.1, 28.5, 1.4, 5.4]);
      //     }
      //
      //   } else {
          chart.updateSeries([35.1, 23.5, 2.4, 5.4]);
      //   }
      // }
      //
      // // Attach the event listener to each checkbox
      // checkboxes.forEach((checkbox) => {
      //   checkbox.addEventListener('change', (event) => handleCheckboxChange(event, chart));
      // });
    }

    if (document.getElementById("sales-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("sales-chart"), this.salesOption);
      chart.render();
    }
  }

  ngOnInit(): void {
  }

  // ngAfterViewInit() {
  //   this.scroller.elementScrolled().pipe(
  //     map(() => this.scroller.measureScrollOffset('bottom')),
  //     pairwise(),
  //     filter(([y1, y2]) => (y2 < y1) && (y2 < 140)),
  //     throttleTime(200)
  //     // filter(event=>this.scroller.getRenderedRange().end === this.scroller.getDataLength())
  //   ).subscribe(res => {
  //     this.ngZone.run(() => {
  //       // this.appointmentService.getPageInfo$().subscribe(res=>{
  //       //   if(res){
  //       //     console.log(res.hasNextPage);
  //       //     if(res.hasNextPage){
  //       //       if (this.scroller.getRenderedRange().end === this.scroller.getDataLength()) {
  //       //         this.pageParams.after = res.endCursor;
  //       //         this.appointmentService.findAllAppointments(this.pageParams.first, this.pageParams.after,this.patientId);
  //       //         this.appointments$ = this.appointmentService.getAllAppointments();
  //       //       }
  //       //     }
  //       //   }
  //       // });
  //     })
  //   });
  // }

  // fetchAppointment(first: number, after: string | null,patientId:string | null) {
  //   console.log("Hi");
  //   this.appointmentService.findAllAppointments(first, after,patientId);
  //   this.appointments$ = this.appointmentService.getAllAppointments();
  // }
  //
  // getCount(patientId:string){
  //   this.appointmentService.findCount(patientId);
  //   this.appointmentsGroupByMonth$ = this.appointmentService.getAppointmentCount$();
  //   // this.appointmentService.findCount(patientId);
  //   // this.totalAppointment$ = this.appointmentService.getTotalAppointment$();
  // }
  //
  // test() {
  //   this.httpClient.post('http://localhost:8080/api/v1/files/name/generate', null, {responseType: 'blob'})
  //     .subscribe(res => {
  //       const a = document.createElement('a');
  //       a.href = window.URL.createObjectURL(res);
  //       a.download = "test.xls";
  //       a.click();
  //     });
  // }

}
