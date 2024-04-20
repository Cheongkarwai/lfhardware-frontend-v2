import {Component, Input, OnInit} from '@angular/core';
import {TuiBreadcrumbsModule} from "@taiga-ui/kit";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [
    TuiBreadcrumbsModule,
    RouterModule,
    CommonModule
  ],
  standalone: true
})
export class BreadcrumbComponent implements OnInit {

  @Input() items:Breadcrumb[] = [];
  constructor() {
  }

  ngOnInit(): void {
  }

}

export interface Breadcrumb{
  caption:string;
  routerLink:string;
}
