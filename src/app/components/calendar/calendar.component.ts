import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
export interface CalendarDate{
  active: boolean;
  label: number;
}
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit{

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

  ngOnInit() {
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
      this.totalDatesInMonth.push(monthLastDate - i + 1);
    }

    // loop to add the dates of the current month
    for (let i=1; i <=lastDate; i++) {
      // check if the current date is today
      let isToday=i===date.getDate() && month===new Date().getMonth() && year===new Date().getFullYear() ? "active": "";
      this.totalDatesInMonth.push(i);
    }

    for (let i=dayEnd; i < 6; i++) {
      this.totalDatesInMonth.push(i - dayEnd + 1);
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
}
