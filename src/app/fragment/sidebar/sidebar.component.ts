import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule, NgbCollapseModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  @Input() hidden:boolean = true;
  constructor() { }
  ngOnInit(): void {
  }

  isCollapsed = true;

  navLinks:any[]= [
    {
      title:'Home',links:[{title:'Dashboard',route:'/admin/dashboard'}],collapsed:true
    },
    {
      title:'Products',links:[{title:'Manage Product',route:'/admin/product/manage-product'}],collapsed:true
    },
    {
      title:'Service Providers',links:[{title:'Manage Service Provider',route:'/admin/service-provider/manage-service-provider'}],collapsed:true
    },
    {
      title:'Orders',links:[{title:'Manage Orders',route:'/admin/order/manage-order'}],collapsed:true
    },
    {
      title:'Transactions',links:[{title:'Manage Transaction',route:'/admin/transaction/manage-transaction'}],collapsed:true
    },
    {
      title:'Workers',links:[{title:'Manage Worker',route:'/admin/worker/manage-worker'}],collapsed:true
    },
    {
      title:'Account',links:[{title:'Profile',route:'/admin/profile'},{title:'Change Password',route:'/admin/profile/change-password'}],collapsed:true
    },
    {
      title:'Users',links:[{title:'Manage User',route:'/admin/user/manage-user'}],collapsed:true
    },
  ]

  toggleNav(i: number) {
    this.navLinks[i].collapsed = !this.navLinks[i].collapsed;
  }

  close(){
    this.hidden = true;
  }

  open(){
    this.hidden = false;
  }

  navigate() {
    this.hidden = true;
  }
}
