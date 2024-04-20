import {Component, Inject, OnInit} from '@angular/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiDataListWrapperModule, TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiRatingModule,
  TuiSelectModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {TuiAlertService, TuiButtonModule, TuiErrorModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ProductService} from "../../../core/product/product.service";
import {concatMap, filter, from, map, Observable, of, share, shareReplay, startWith, switchMap} from "rxjs";
import {Product} from "../../../core/product/product.interface";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Pageable} from "../../../core/page/pagination.interface";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {CartService} from "../../../core/cart/cart.service";
import {AlertService} from "../../../core/service/alert.service";
import {ButtonComponent} from "../../../components/button/button.component";
import {RatingComponent} from "../../../components/rating/rating.component";
import {AverageRatingPipe} from "../../../core/pipe/average-rating.pipe";
import {ToastService} from "../../../core/dialog/toast.service";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputCountModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiRatingModule,
    FormsModule,
    TuiTagModule,
    LoadingSpinnerComponent,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    ButtonComponent,
    RouterLink,
    NgOptimizedImage,
    RatingComponent,
    AverageRatingPipe
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        min: ({min}: { min: string }) => `Must be more than ${min}`,
        required: 'Please select atleast one',
        email: 'Enter a valid email',
        maxlength: ({requiredLength}: { requiredLength: string }) =>
          `Maximum length — ${requiredLength}`,
      },
    }
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  ratingFormControl = new FormControl();
  sizeFormControl = new FormControl('', [Validators.required]);
  quantityFormControl = new FormControl(1, [Validators.min(1)]);

  selectedId = 1;

  product$!: Observable<Product>;

  top4Products$!: Observable<Product[]>;

  size$!: Observable<string[]>;
  quantity$!:Observable<number>;

  inStock$!:Observable<any>;




  constructor(private router: Router, private activatedRoute: ActivatedRoute, private productService: ProductService, private cartService: CartService,private toastService: ToastService) {
    this.selectedId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.product$ = this.productService.findById(this.selectedId).pipe(shareReplay(),map(product=>{
      product.product_images = product.product_images.filter(image=> image.type === 'productGroupImage');
      return product;
    }));
    this.top4Products$ = this.product$.pipe(switchMap(value => this.productService.findAll({
      page: 0,
      page_size: 4,
      search: {
        attributes : [],
        keyword : ''
      },
      sort: '',
      brands: [value.brand],
      categories: [value.category],
      min_quantity:'1'
    })
      .pipe(map(pageable => pageable.items.filter(product => product.id !== this.selectedId)))));

    //Set size
    this.size$ = this.product$.pipe(map(product => {
      const size = product.stocks.map(stock => stock.size);
      return size;
    }));
    //Set quantity
    this.quantity$ = this.sizeFormControl.valueChanges.pipe(switchMap(size=>{
        return this.product$.pipe(map(product=>{
          const stock = product.stocks.find(stock=>stock.size === size);
          return stock?.available_quantity ? stock.available_quantity : 0;
        }));
    }));

    this.inStock$ = this.sizeFormControl.valueChanges.pipe(startWith('N/A'),switchMap(size=>{
      return this.product$.pipe(map(product=>{
        const stock = product.stocks.find(stock=>stock.size === size);
        return  stock?.available_quantity ? stock?.available_quantity > 0 ? 'In Stock' : 'No Stock'  : 'N/A';
      }));
    }));
  }

  addToCart(product: Product) {
    this.sizeFormControl.markAllAsTouched();
    this.quantityFormControl.markAllAsTouched();

    if (this.quantityFormControl.valid && this.sizeFormControl.valid) {
      this.cartService.addItem({
        product_id: product.id,
        quantity: this.quantityFormControl.getRawValue() as number,
        size: this.sizeFormControl.getRawValue() as string
      }).subscribe({
        next: res => {
          this.router.navigate(['../', 'product', 'view']).then(res => {
            this.toastService.open('Item is added into your cart.', 'success');
          })
        },
        error: err => this.toastService.open('There is something wrong. Please try again later', 'error')
      });
    }else{
      this.toastService.open('Please select a size', 'error')
    }
  }


}
