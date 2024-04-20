import {Component, inject, Input, OnDestroy} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DialogSubscriptionService} from "../../../../core/dialog/dialog.service";
import {Product} from "../../../../core/product/product.interface";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CartService} from "../../../../core/cart/cart.service";
import {AlertService} from "../../../../core/service/alert.service";
import {Status} from "../../../../components/alert-dialog/alert-dialog.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {LoginService} from "../../../../core/user/login.service";

@Component({
  selector: 'app-product-quickview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, RouterLink],
  templateUrl: './product-quickview.component.html',
  styleUrl: './product-quickview.component.scss'
})
export class ProductQuickviewComponent implements OnDestroy{

  @Input()
  product!:Product;

  showLoading: boolean = false;

  dialog = inject(DialogSubscriptionService);
  sizeFormControl:FormControl<string | null> = new FormControl('', Validators.required);
  constructor(private cartService: CartService, private loginService : LoginService, private alertService: AlertService,
              private router: Router) {
  }

  close(){
    this.sizeFormControl.reset();
    this.showLoading = false;
    this.dialog.showQuickViewDialog = false;
  }

  addToCart() {
    this.sizeFormControl.markAllAsTouched();
    this.showLoading = true;
    if(this.sizeFormControl.valid){
      this.cartService.addItem({
        product_id: this.product.id,
        quantity: 1,
        size: this.sizeFormControl.getRawValue() as string
      }).subscribe({
        next: res => {
          this.alertService.showSuccess('An item is added to your cart')
          this.sizeFormControl.reset();
          this.showLoading = false;
        },
        error: err => {
          this.alertService.showAlert('Error', 'Oops. Something went wrong', Status.ERROR);
          this.showLoading = false;
        }
      });
    }else{
      this.showLoading = false;
    }
  }

  ngOnDestroy() {
    this.dialog.showQuickViewDialog = false;
  }
}
