import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "../../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {AppointmentService} from "../../../core/appointment/appointment.service";
import {map, Observable} from "rxjs";
import {Pageable, PageRequest} from "../../../core/page/pagination.interface";
import {Appointment} from "../../../core/appointment/appointment.interface";
import {CustomerService} from "../../../core/customer/customer.service";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {RouterLink} from "@angular/router";
import {BadgeComponent} from "../../../components/badge/badge.component";

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    LoadingSpinnerComponent,
    RouterLink,
    BadgeComponent
  ],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss'
})
export class AppointmentHistoryComponent implements OnInit{

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Appointment History',
      routerLink: 'appointment-history'
    },
  ];

  appointments$!: Observable<Pageable<Appointment>>;
  pageRequest: PageRequest = {
    page: 0,
    page_size: 6,
    sort: '',
    search: {
      attributes : [],
      keyword : ''
    }
  }

  appointmentMenus: {hidden: boolean}[] = [];
  constructor(private customerService: CustomerService) {
  }
  ngOnInit() {
    this.appointments$ = this.customerService.findCurrentCustomerAppointments(this.pageRequest,null, ['COMPLETED','REFUNDED', 'CANCELLED'])
      .pipe(map(appointmentPageable=> {
        appointmentPageable.items.forEach((item,index)=> this.appointmentMenus[index] = {hidden:true});
        return appointmentPageable;
      }));
  }

  openMenu(i: number) {
    this.appointmentMenus.forEach((menu,index)=> {
      if(index === i){
        this.appointmentMenus[i].hidden = false;
      }else{
        menu.hidden = true
      }
    });
  }
}
