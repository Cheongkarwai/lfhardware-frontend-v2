import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faMinus, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {TuiFieldErrorPipeModule, TuiInputCountModule} from "@taiga-ui/kit";
import {TuiErrorModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CartService} from "../../core/cart/cart.service";
import {map, Observable, share, shareReplay, Subject, takeUntil, tap} from "rxjs";
import {CartItem} from "../../core/cart/cart-item.interface";
import {Cart} from "../../core/cart/cart.interface";
import {AlertService} from "../../core/service/alert.service";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";
import {merge} from "rxjs/internal/operators/merge";
import {ButtonComponent} from "../../components/button/button.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    FaIconComponent,
    TuiInputCountModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    RouterModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    LoadingSpinnerComponent,
    ButtonComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Cart',
      routerLink: `/cart`
    },
  ];

  protected readonly faTrash = faTrash;
  protected readonly faPlus = faPlus;
  protected readonly faMinus = faMinus;

  // cartItems =;

  cartForm = this.fb.group({
    subtotal:[0],
    shipping_fees:[0],
    total:[0],
    items:new FormArray<FormGroup<{ quantity: FormControl<number | null>, product_id: FormControl<number | null>, stock_id: FormControl<number | null>, cart_id: FormControl<number | null> }>>([])
  })

  cart$!: Observable<Cart>;

  destroy$ = new Subject<void>();

  constructor(private cartService: CartService, private fb: FormBuilder, private alertService:AlertService) {
  }
  ngOnInit(): void {
    this.findItemCart();
    // this.cartForm.controls.items.valueChanges.pipe(takeUntil(this.destroy$),).subscribe(res=>{
    //   console.log(res);
    //   const item = res[0];
    //   this.cartService.updateCartItemQuantity(item.stock_id as number, item.cart_id as number, item.quantity as number).subscribe();
    // });
  }


  findItemCart(){
    this.cart$ = this.cartService.findCart().pipe(shareReplay(), map(cart => {
      cart.items.map(item => this.addCartItemQuantityFormControl(item.quantity, item.product_id, item.stock_id, item.cart_id));
      return cart;
    }));
  }

  addCartItemQuantityFormControl(quantity: number, productId: number, stockId:number, cartId:number) {
    const formGroup = this.fb.group({
      quantity: [quantity,[Validators.min(0)]],
      product_id: [productId,[Validators.min(0)]],
      stock_id:[stockId],
      cart_id:[cartId]
    });
    this.cartItemsFormArray.push(formGroup);
  }


  get cartItemsFormArray(){
    return this.cartForm.controls['items'] as FormArray;
  }

  deleteCartItem(item:CartItem) {
    this.cartService.removeCartItem(item).subscribe(res=>{
      this.alertService.showSuccess('Item Removed');
      this.findItemCart();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeQuantity(index:number) {
    const itemsFormArray = this.cartForm.controls.items;
    const quantity = itemsFormArray.at(index).controls.quantity.getRawValue();
    const stockId = itemsFormArray.at(index).controls.stock_id.getRawValue();
    const cartId = itemsFormArray.at(index).controls.cart_id.getRawValue();
    if(quantity){
      this.cartService.updateCartItemQuantity(stockId as number, cartId as number, quantity as number).subscribe();
    }
  }
}
