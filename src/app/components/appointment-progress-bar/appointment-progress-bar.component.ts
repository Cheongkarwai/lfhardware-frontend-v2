import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Appointment, AppointmentCompletionImage} from "../../core/appointment/appointment.interface";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-appointment-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-progress-bar.component.html',
  styleUrl: './appointment-progress-bar.component.scss'
})
export class AppointmentProgressBarComponent {

  @Output()
  handleViewScreenshot = new EventEmitter<AppointmentCompletionImage[]>();

  @Input()
  appointment!: Appointment;

  viewScreenshots(images: AppointmentCompletionImage[]){
    this.handleViewScreenshot.emit(images);
  }
}
