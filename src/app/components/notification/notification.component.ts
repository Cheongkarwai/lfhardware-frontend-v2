import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {map, Observable} from "rxjs";
import {Notification, NotificationService} from "../../core/notification/notification.service";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit , AfterViewInit{
  notifications$!: Observable<Notification[]>;
  //notification$!: Observable<MessageEvent[]>;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.streamNotification().subscribe();
    this.notifications$ = this.notificationService.notifications;
    //this.notifications$ = this.notificationService.findUserNotification();
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  sendNotification() {
    this.notificationService.save({message: 'Hi', created_at: new Date(), user_id: ''})
      .subscribe();
  }
}
