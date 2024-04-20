import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiErrorModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiMultiSelectModule,
  TuiRadioLabeledModule,
  TuiRadioModule,
  TuiSelectModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {BehaviorSubject, from, map, Observable, of, Subject, Subscription, switchMap} from "rxjs";
import {Cart} from "../../core/cart/cart.interface";
import {CartService} from "../../core/cart/cart.service";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";
import {CommonModule} from "@angular/common";
import {TuiLetModule} from "@taiga-ui/cdk";
import {CityService} from "../../core/city/city.service";
import {StateService} from "../../core/state/state.service";
import {CountryService} from "../../core/country/country.service";
import {Router, RouterModule} from "@angular/router";
import {Validator} from "../../core/validator";
import {Address, Recipient} from "../../core/order/order.interface";
import {OrderService} from "../../core/order/order.service";
import {CartItem} from "../../core/cart/cart-item.interface";
import {MatFormField} from "@angular/material/form-field";
import {StripeElementsOptions, StripePaymentElementChangeEvent, StripePaymentElementOptions} from "@stripe/stripe-js";
import {
  injectStripe,
  StripeAddressComponent,
  StripeElementsDirective,
  StripeExpressCheckoutComponent,
  StripeFpxBankComponent,
  StripePaymentElementComponent
} from "ngx-stripe";
import {PaymentService} from "../../core/payment/payment.service";
import {MatInput} from "@angular/material/input";
import {AlertService} from "../../core/service/alert.service";
import {ShipmentService} from "../../core/shipment/shipment.service";
import {AvailableShipment} from "../../core/shipment/available-shipment.interface";
import {PolymorpheusContent} from "@tinkoff/ng-polymorpheus";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiTagModule,
    FaIconComponent,
    LoadingSpinnerComponent,
    TuiDataListWrapperModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLetModule,
    TuiMultiSelectModule,
    TuiComboBoxModule,
    TuiSelectModule,
    TuiInputNumberModule,
    TuiRadioLabeledModule,
    TuiRadioModule,
    MatFormField,
    StripeElementsDirective,
    StripePaymentElementComponent,
    MatInput,
    StripeFpxBankComponent,
    StripeAddressComponent,
    StripeExpressCheckoutComponent,
    ReactiveFormsModule
  ],
  providers: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {

  cart$!: Observable<Cart>;

  paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  paymentIntentId = '';

  stripe = injectStripe();

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  checkoutForm = this.fb.group({
    personal_information: this.fb.group({
      first_name: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      last_name: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      phone_number: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      email_address: ['', [Validators.required, Validator.noWhitespaceValidator(), Validator.emailValidator()]],
    }),
    delivery_address: this.fb.group({
      address_line_1: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      address_line_2: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      city: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      state: ['', [Validators.required, Validator.noWhitespaceValidator()]],
      zipcode: ['', [Validators.required, Validator.noWhitespaceValidator()]],
    }),
    courier: this.fb.group({
      service_id: ['', Validators.required],
      courier_id: [''],
      courier_name: [''],
      courier_logo: [''],
      fees: [0, Validators.min(1)],
    }),
    // shipping_method: ['', Validators.required],
    payment_method: ['', Validators.required],
    items: this.fb.array([]),
    subtotal: [0],
    total: [0],
    // shipping_fees: [0]
  })

  cities$!: Observable<string[]>;
  states$!: Observable<string[]>;
  countries$!: Observable<string[]>;
  paymentIntent$!: Observable<any>;
  destroy$ = new Subject<void>();

  shipments$!: Observable<AvailableShipment[]>;
  private selectShippingDialog!: Subscription;

  constructor(private cartService: CartService, private fb: FormBuilder, private alertService: AlertService, private cityService: CityService, private stateService: StateService,
              private countryService: CountryService, private orderService: OrderService, private router: Router, private paymentService: PaymentService, private shipmentService: ShipmentService,
              @Inject(TuiDialogService) private readonly dialogs: TuiDialogService, @Inject(TuiAlertService) private readonly alerts: TuiAlertService,) {
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    // this.paymentService.createCheckoutSession().pipe(switchMap(clientSecret=> {
    //   return this.stripe.initEmbeddedCheckout({clientSecret: clientSecret}).pipe(map(res=>res.mount("#checkout")),takeUntil(this.destroy$))
    // })).subscribe();
    this.paymentIntent$ = this.paymentService.createPaymentIntents({
      amount: 500.00,
      currency: 'MYR'
    }).pipe(map(paymentIntent => {
      this.elementsOptions.clientSecret = paymentIntent.client_secret;
      this.paymentIntentId = paymentIntent.id;
      return paymentIntent;

    }));
    this.findItemCart();
    this.cities$ = this.cityService.findAll().pipe(map(cities => cities.map(city => city.name)));
    this.states$ = this.stateService.findAll().pipe(map(states => states.map(state => state.name)));
    this.countries$ = this.countryService.findAll().pipe(map(countries => countries.map(country => country.name)));


  }

  calculateShipmentRate(items:CartItem[]){
    this.checkoutForm.controls.delivery_address.valueChanges.subscribe(deliveryAddress=> {
      if (deliveryAddress.address_line_1 != '' && deliveryAddress.address_line_2 != '' && deliveryAddress.zipcode != '' && deliveryAddress.state !='' && deliveryAddress.city != '') {
        this.shipments$ = this.shipmentService.getAllAvailableShipment({
          length: null,
          width: null,
          height: null,
          weight: items.map(item=> item.weight).reduce((accumulator, currentValue)=> accumulator + currentValue , 0),
          date_coll: null,
          send_code: deliveryAddress.zipcode || '',
          send_country: 'MY',
          send_state: this.shipmentService.getStateCode(deliveryAddress.state || ''),
          pick_code: '43200',
          pick_state: 'sgr',
          pick_country: 'MY',
        }).pipe(map(res => {
          const shipments: AvailableShipment[] = [];
          for (let i = 0; i < res.result.length; i++) {
            if (res.result[i].status === 'Success') {
              shipments.push(...res.result[i].rates);
            }
          }
          return shipments;
        }));
      }else{
        this.shipments$ =  new BehaviorSubject([]).asObservable();
      }
    })
  }

  findItemCart() {
    this.cart$ = this.cartService.findCart().pipe(map(cart => {

      this.calculateShipmentRate(cart.items || []);

      for(const item of cart.items || []){
        this.checkoutForm.controls['items'].push(new FormControl(item))
      }

      this.checkoutForm.patchValue({
        subtotal: cart.subtotal,
        total: cart.total,
      });

      return cart;
    }));
  }

  changePaymentMethod(event: StripePaymentElementChangeEvent) {
    this.checkoutForm.controls['payment_method'].setValue(event.value.type);
  }


  pay() {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.invalid) {
      this.alertService.showError('Please fill in all the required fields');
      return;
    }
    const {
      personal_information, delivery_address, payment_method, items,
      courier, total, subtotal
    } = this.checkoutForm.getRawValue();

    let recipient = personal_information as Recipient;
    let deliveryAddress = delivery_address as Address;
    recipient['delivery_address'] = deliveryAddress;
    let cartItems = items as CartItem[];
    this.orderService.createOrder({
      courier:courier,
      recipient: recipient,
      shipping_method: '',
      payment_method: payment_method as string,
      items: cartItems,
      delivery_status: 'PENDING',
      payment_status: 'UNPAID',
      subtotal: subtotal as number,
      total: total as number,
      shipping_fees: courier.fees as number
    }).subscribe({
      next: orderDetails => {
        if (orderDetails) {
          this.paymentService.addPaymentIntentMetadata(this.paymentIntentId, {'order_id': orderDetails.id}).subscribe({
            next: res => {
              const paymentElementSubmit = of(this.paymentElement.elements.submit());
              paymentElementSubmit.subscribe(res => {
                this.stripe.confirmPayment({
                  elements: this.paymentElement.elements,
                  clientSecret: this.elementsOptions.clientSecret as string,
                  confirmParams: {
                    return_url: `${window.location.origin}/order/view`,
                    receipt_email: recipient.email_address as string,
                    shipping: {
                      name: recipient.first_name + " " + recipient.last_name,
                      address: {
                        line1: deliveryAddress.address_line_1 as string,
                        line2: deliveryAddress.address_line_2 as string,
                        state: deliveryAddress.state as string,
                        postal_code: deliveryAddress.zipcode as string
                      }
                    }
                  },
                  redirect: 'always'
                }).subscribe({
                  next: res => {
                    if (res.error) {
                      this.alertService.showError(res.error.message as string);
                    }
                  },
                  error: err => console.log(err)
                })
              })
            },
            error: err => this.alertService.showError(`Something went wrong.`)
          });
        }
      }, error: err => console.log(err)
    });
  }

  get firstNameControl() {
    return this.checkoutForm.controls.personal_information.controls.first_name as FormControl;
  }

  get lastNameControl() {
    return this.checkoutForm.controls.personal_information.controls.last_name as FormControl;
  }

  get emailAddressControl() {
    return this.checkoutForm.controls.personal_information.controls.email_address as FormControl;
  }

  get phoneNumberControl() {
    return this.checkoutForm.controls.personal_information.controls.phone_number as FormControl;
  }

  get addressLine1Control() {
    return this.checkoutForm.controls.delivery_address.controls.address_line_1 as FormControl;
  }

  get addressLine2Control() {
    return this.checkoutForm.controls.delivery_address.controls.address_line_2 as FormControl;
  }

  get cityControl() {
    return this.checkoutForm.controls.delivery_address.controls.city as FormControl;
  }

  get stateControl() {
    return this.checkoutForm.controls.delivery_address.controls.state as FormControl;
  }

  get zipcodeControl() {
    return this.checkoutForm.controls.delivery_address.controls.zipcode as FormControl;
  }


  get deliveryCourierNameControl() {
    return this.checkoutForm.controls.courier.controls.courier_name as FormControl;
  }

  get deliveryCourierLogoControl() {
    return this.checkoutForm.controls.courier.controls.courier_logo as FormControl;
  }

  get deliveryServiceIdControl() {
    return this.checkoutForm.controls.courier.controls.service_id as FormControl;
  }

  get courierFeesControl() {
    return this.checkoutForm.controls.courier.controls.fees as FormControl;
  }

  get paymentMethodControl() {
    return this.checkoutForm.controls.payment_method as FormControl;
  }

  openSelectShippingDialog(content: PolymorpheusContent<TuiDialogContext>) {
    this.shipments$.subscribe(res=>console.log(res));
    this.selectShippingDialog = this.dialogs.open(content, {dismissible: false}).subscribe()
  }

  selectDelivery(shipment: AvailableShipment) {
    this.checkoutForm.controls['courier'].patchValue({
      courier_id: shipment.courier_id,
      courier_logo: shipment.courier_logo,
      courier_name: shipment.courier_name,
      service_id: shipment.service_id,
      fees: shipment.shipment_price
    });
    this.selectShippingDialog.unsubscribe()
  }
}
