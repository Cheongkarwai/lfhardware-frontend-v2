import {Component, Inject} from '@angular/core';
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";
import {Order} from "../../../../../core/order/order.interface";
import {Observable} from "rxjs";
import {OrderDetails} from "../../../../../core/order/order-details.interface";
import {OrderService} from "../../../../../core/order/order.service";
import {TuiDialogContext} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";

@Component({
  selector: 'app-view-order-details',
  standalone: true,
    imports: [
        LoadingSpinnerComponent,
        CommonModule,
    ],
  templateUrl: './view-order-details.component.html',
  styleUrl: './view-order-details.component.scss'
})
export class ViewOrderDetailsComponent {

  orderDetails$!:Observable<OrderDetails>

  constructor(private orderService: OrderService,@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>) {
    const orderId = context.data as any;
    this.orderDetails$ = orderService.findById(orderId);
  }
}
