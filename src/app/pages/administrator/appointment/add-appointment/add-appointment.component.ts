import {Component, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {FullCalendarComponent, FullCalendarModule} from "@fullcalendar/angular";
import {Calendar, CalendarOptions, DateSelectArg, EventClickArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5 from "@fullcalendar/bootstrap5";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCancel} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FullCalendarModule, TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule, TuiTagModule, TuiDataListWrapperModule, TuiComboBoxModule, FaIconComponent],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss'
})
export class AddAppointmentComponent {

  faNotAvailable = faCancel;
  calendarOption!: CalendarOptions;
  events$!: Observable<EventInput[]>;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {

    this.calendarOption = {
      plugins: [dayGridPlugin, timeGridPlugin, bootstrap5, listPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap5',
      buttonIcons: {
        prev: 'bi bi-chevron-left',
        next: 'bi bi-chevron-right',
        prevYear: 'bi bi-chevron-double-left',
        nextYear: 'bi bi-chevron-double-right' // double chevron
      },
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ""
      },
      selectable: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      longPressDelay: 1,
      customButtons: {
        prev: {
          text: 'Prev',
          click: this.handlePreviousClick.bind(this)
        },
        next: {
          text: 'Next',
          click: this.handleNextClick.bind(this)
        }
      }
    };
  }

  open = false;
  items = ['New','Existing'];
  addAppointmentForm = this.fb.group({
    test:['']
  }) ;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarApi!: Calendar;
  onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  ngAfterViewInit() {
    this.calendarApi = this.calendarComponent.getApi();
  }

  handleEventClick(event: EventClickArg) {

    // this.dialog.open(this.editEventTemplate,{});
    //
    // this.editAppointmentForm.patchValue({
    //   timestamp:event.event.start,
    //   patient:event.event.id
    // });
  }

  handleNextClick(event: any) {
    //let currentRange = this.calendarApi.getCurrentData().dateProfile.currentRange;
    // this.findEventsBetween(currentRange.start, currentRange.end);
    this.calendarApi.prev();
  }

  handlePreviousClick(event: any) {
    //let currentRange = this.calendarApi.getCurrentData().dateProfile.currentRange;
    // this.findEventsBetween(currentRange.start, currentRange.end);
    this.calendarApi.next();
  }

  handleDateSelect(event: DateSelectArg) {
    console.log(event.start);
    console.log(event.endStr);
    // const selectTemplate = this.dialog.open(this.addEventTemplate,{});

  }

  openDropdown() {
    this.open = !this.open;
  }
}
