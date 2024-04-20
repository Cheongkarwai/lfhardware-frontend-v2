import {Component, Inject, Injector} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";
import {TuiComboBoxModule, TuiDataListWrapperModule, TuiInputModule} from "@taiga-ui/kit";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiDialogContext, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {Order} from "../../../../../core/order/order.interface";
import {OrderService} from "../../../../../core/order/order.service";
import {AlertService} from "../../../../../core/service/alert.service";
import {DialogSubscriptionService} from "../../../../../core/dialog/dialog.service";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {Status} from "../../../../../components/alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-update-delivery-status',
  standalone: true,
  imports: [
    AsyncPipe,
    LoadingSpinnerComponent,
    NgIf,
    TuiInputModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiComboBoxModule,
    TuiTextfieldControllerModule,
    ButtonComponent
  ],
  templateUrl: './update-delivery-status.component.html',
  styleUrl: './update-delivery-status.component.scss'
})
export class UpdateDeliveryStatusComponent {

  deliveryStatusControl = new FormControl('',Validators.required);
  order:Order;

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<boolean>, private orderService: OrderService, private alertService: AlertService,
              private dialogSubscriptionService: DialogSubscriptionService) {
    this.order = context.data as any;
    this.deliveryStatusControl.setValue(this.order.delivery_status);
  }
  readonly deliveryStatus:string[]= [
    'OUT_FOR_DELIVERY',
    'PENDING',
    'CANCELLED',
    'DELIVERED'
  ];

  updateStatus() {
    this.deliveryStatusControl.markAllAsTouched();
    if(this.deliveryStatusControl.valid && this.deliveryStatusControl.getRawValue() !== this.order.delivery_status){
      this.orderService.partialUpdate(this.order.id,{delivery_status : this.deliveryStatusControl.getRawValue()})
        .subscribe({
          next:res=> {
            this.dialogSubscriptionService.dialog$.unsubscribe();
            this.alertService.showAlert('Updated Successfully', 'Delivery Order Status is updated', Status.SUCCESS);
            this.orderService.refresh.next();
          },
          error: err=> this.alertService.showAlert('Something went wrong', `${err}`, Status.SUCCESS)
        });
    }
  }
}
