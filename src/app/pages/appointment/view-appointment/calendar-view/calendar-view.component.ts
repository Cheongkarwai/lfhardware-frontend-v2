import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {CalendarDate} from "../../../../components/calendar/calendar.component";
import {BehaviorSubject, Observable, startWith, combineLatest, switchMap} from "rxjs";
import {CustomerService} from "../../../../core/customer/customer.service";
import {Pageable, PageRequest} from "../../../../core/page/pagination.interface";
import {Appointment} from "../../../../core/appointment/appointment.interface";
import {ButtonComponent} from "../../../../components/button/button.component";
import {BadgeComponent} from "../../../../components/badge/badge.component";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, LoadingSpinnerComponent],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
  months: string[] = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];


  dates: CalendarDate[] = [];
  totalDatesInMonth: number[] = [];
  currentMonth : number= 0;
  currentYear: number = 0;
  pageRequest: PageRequest = {
    page: 0,
    page_size: 5,
    sort: '',
    search: {
      keyword: '',
      attributes: []
    }
  };

  handleDate$: BehaviorSubject<Date>  = new BehaviorSubject<Date>(new Date());
  handlePage$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.pageRequest);
  selectedAppointments$!: Observable<Pageable<Appointment>>;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit() {
    this.selectedAppointments$ = combineLatest([this.handleDate$.pipe(startWith(new Date())), this.handlePage$
      .pipe(startWith(this.pageRequest))])
      .pipe(switchMap(([date,page])=>{
        return this.customerService.findCurrentCustomerAppointments(this.pageRequest, date, []);
    }));
    const todayDate = new Date();
    this.currentMonth = todayDate.getMonth();
    this.currentYear = todayDate.getFullYear();
    this.findDates(this.currentYear, this.currentMonth);
  }

  findDates(year: number, month: number){
    this.totalDatesInMonth = [];
    let date=new Date(); // creates a new date object with the current date and time


    // get the first day of the month
    let dayOne=new Date(year, month, 1).getDay();

    // get the last date of the month
    let lastDate=new Date(year, month + 1, 0).getDate();

    // get the day of the last date of the month
    let dayEnd=new Date(year, month, lastDate).getDay();

    // get the last date of the previous month
    let monthLastDate=new Date(year, month, 0).getDate();

    for(let i = dayOne; i > 0; i--){
      this.dates.push({label : monthLastDate - i + 1 ,active : false});
    }

    // loop to add the dates of the current month
    for (let i=1; i <=lastDate; i++) {
      // check if the current date is today
      let isToday=i===date.getDate() && month===new Date().getMonth() && year===new Date().getFullYear() ? "active": "";
      this.dates.push({label:i, active: i===date.getDate() && month===new Date().getMonth() && year===new Date().getFullYear()});
    }

    for (let i=dayEnd; i < 6; i++) {
      this.dates.push({label:i - dayEnd + 1, active: false});
    }

  }

  navigateToNextMonth(){
    const currentDate = new Date(this.currentYear, this.currentMonth);
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    this.findDates(newDate.getFullYear(), newDate.getMonth());
    this.currentMonth = newDate.getMonth();
    this.currentYear = newDate.getFullYear();
  }

  navigateToPreviousMonth(){
    const currentDate = new Date(this.currentYear, this.currentMonth);
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    this.findDates(newDate.getFullYear(), newDate.getMonth());
    this.currentMonth = newDate.getMonth();
    this.currentYear = newDate.getFullYear();
  }

  selectDate(day: number) {
    this.handleDate$.next(new Date(this.currentYear, this.currentMonth, day));
  }
}
