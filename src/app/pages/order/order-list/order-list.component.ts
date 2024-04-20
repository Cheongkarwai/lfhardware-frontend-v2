import {Component, OnInit} from '@angular/core';
import {TuiPaginationModule, TuiStepperModule, TuiTagModule} from "@taiga-ui/kit";
import {BreadcrumbComponent} from "../../../components/breadcrumb/breadcrumb.component";
import {CommonModule} from "@angular/common";
import {OrderService} from "../../../core/order/order.service";
import {BehaviorSubject, map, Observable, ReplaySubject, startWith, switchMap} from "rxjs";
import {Pageable, PageRequest} from "../../../core/page/pagination.interface";
import {Order} from "../../../core/order/order.interface";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {MathCeilPipe} from "../../../core/pipe/math-ceil.pipe";
import {RouterLink} from "@angular/router";
import {RemoveUnderscorePipe} from "../../../core/pipe/remove-underscore.pipe";
import {OrderPageRequest} from "../../../core/order/order-page-request.interface";
import {ButtonComponent} from "../../../components/button/button.component";
import {OrderProduct} from "../../../core/order/order-product.interface";

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiStepperModule,
    BreadcrumbComponent,
    LoadingSpinnerComponent,
    MathCeilPipe,
    TuiPaginationModule,
    RouterLink,
    TuiTagModule,
    RemoveUnderscorePipe,
    ButtonComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit{
  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Order',
      routerLink: '/order/view'
    },
  ];

  a = [1,2,3,4,5,6,7]

  $pageableOrders!:Observable<Pageable<OrderProduct>>;

  pageRequest:OrderPageRequest = {
    page:0,
    page_size:5,
    sort:'',
    search:{
      attributes : [],
      keyword : ''
    },
    delivery_status: ''
  }

  pagination$: ReplaySubject<OrderPageRequest> = new ReplaySubject<OrderPageRequest>(1);

  totalElements:number = 0;
  ngOnInit(): void {
    this.$pageableOrders = this.pagination$.pipe(startWith(this.pageRequest),switchMap(pageRequest=>{
      return this.orderService.findAllOrderProducts(pageRequest).pipe(map(orderPageable=> {
        this.totalElements = orderPageable.total_elements || 0;
        return orderPageable;
      }));
    }));
  }

  findAllOrders(){
  }

  constructor(private orderService:OrderService) {
  }

  fetchPage(page: number) {
    this.pageRequest.page = page;
    this.findAllOrders();
  }

  previousPage() {
    if(this.pageRequest.page > 0) {
      this.pageRequest.page--;
      this.pagination$.next(this.pageRequest);
    }
  }

  nextPage(){
    if(this.totalElements > 0){
        console.log(Math.ceil(this.totalElements / this.pageRequest.page_size));
        if((this.pageRequest.page + 1) !== Math.ceil(this.totalElements/this.pageRequest.page_size)){
          this.pageRequest.page++;
          this.pagination$.next(this.pageRequest);
        }
    }
  }
}
