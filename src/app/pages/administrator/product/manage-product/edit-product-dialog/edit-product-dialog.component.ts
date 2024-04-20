import {Component, Inject} from '@angular/core';
import {
  TuiDialogContext,
  TuiHintModule,
  TuiPrimitiveTextfieldModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiInputModule, TuiInputNumberModule, TuiTextareaModule} from "@taiga-ui/kit";
import {TuiCurrencyPipeModule} from "@taiga-ui/addon-commerce";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {Validator} from "../../../../../core/validator";
import {ProductService} from "../../../../../core/product/product.service";
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {
  MultipleFileUploadComponent
} from "../../../../../components/multiple-file-upload/multiple-file-upload.component";
import {catchError, forkJoin, map, Observable, of} from "rxjs";
import {Brand} from "../../../../../core/product/brand.interface";
import {Category} from "../../../../../core/product/category.interface";
import {Product, Stock} from "../../../../../core/product/product.interface";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";
import {AlertService} from "../../../../../core/service/alert.service";

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [
    TuiPrimitiveTextfieldModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
    TuiHintModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    MultipleFileUploadComponent,
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './edit-product-dialog.component.html',
  styleUrl: './edit-product-dialog.component.scss'
})
export class EditProductDialogComponent {

  editProductForm: FormGroup;

  showLoading = false;

  brands$: Observable<Brand[]>;
  categories$: Observable<Category[]>;
  product$: Observable<Product | null>;

  productObs$: Observable<[Brand[], Category[], Product | null]>;

  private productId:any;
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>, private fb: FormBuilder,
    private productService: ProductService, private alertService: AlertService
  ) {
    this.editProductForm = this.fb.group({
      name: ['', [Validators.required, Validator.noWhitespaceValidator], [Validator.createProductNameValidator(this.productService)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      category: [null, Validators.required],
      brand: [null, Validators.required],
      stocks: this.fb.array([]),
      image: this.fb.group({
        display_product: [null, Validators.required],
        product_details_showcase: [[], Validators.required]
      })
    });
    this.brands$ = this.productService.findAllProductBrands();
    this.categories$ = this.productService.findAllProductCategories();

    this.productId  = context?.data;
    this.product$ = this.productService.findById(this.productId)
      .pipe(map(product => {
        product.stocks.forEach(stock=> {
          this.stockFormArray.push(this.fb.group({
            size: ['', Validators.required],
            available_quantity: [0, [Validators.required, Validators.min(1)]],
            length: [0, [Validators.required, Validators.min(1)]],
            width: [0, [Validators.required, Validators.min(1)]],
            height: [0, [Validators.required, Validators.min(1)]],
            weight: [0, [Validators.required, Validators.min(1)]],
          }))
        });
        this.editProductForm.patchValue(product);
        const productImages = product.product_images.filter(product=> product.type === 'productImage');
        const productGroupImages = product.product_images.filter(product=> product.type === 'productGroupImage');

        for(let productImage of productImages){
          this.productImageControl.setValue(new File([], productImage.path));
        }
        this.productGroupImageControl.setValue(productGroupImages.map(productGroupImage=>new File([], productGroupImage.path)))


        return product;
      }), catchError(err => of(null)));

    this.productObs$ = forkJoin([this.brands$, this.categories$, this.product$]);
  }

  get nameControl() {
    return this.editProductForm.controls['name'] as FormControl;
  }

  get descriptionControl() {
    return this.editProductForm.controls['description'] as FormControl;
  }

  get priceControl() {
    return this.editProductForm.controls['price'] as FormControl;
  }

  get quantityControl() {
    return this.editProductForm.controls['quantity'] as FormControl;
  }


  get categoryControl() {
    return this.editProductForm.controls['category'] as FormControl;
  }

  get brandControl() {
    return this.editProductForm.controls['brand'] as FormControl;
  }

  get productImageControl() {
    return this.editProductForm.controls['image'].get('display_product') as FormControl;
  }

  get stockFormArray() {
    return this.editProductForm.controls['stocks'] as FormArray;
  }

  get productGroupImageControl() {
    return this.editProductForm.controls['image'].get('product_details_showcase') as FormControl;
  }

  close(): void {
    this.context.completeWith(false);
  }

  editProduct() {

    this.editProductForm.markAllAsTouched();

    if(this.editProductForm.valid){
      this.productService.update(this.productId,this.editProductForm.getRawValue())
        .subscribe({
          next:res=> {
            this.showLoading = false;
            this.context.completeWith(false);
            this.alertService.showSuccess('Update successful');
            this.productService.reload();
          },
          error:err=> this.alertService.showError('Something went wrong. Please try again later')
        });
    }
  }

  addStockRow() {
    this.stockFormArray.markAllAsTouched();
    if (this.stockFormArray.valid) {
      this.stockFormArray.push(this.fb.group({
        size: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(1)]]
      }))
    }
  }

  removeStockRow(i: number) {
    this.stockFormArray.removeAt(i);
  }

  compareCategory(category: Category, selectedCategory: Category){
    return category.id === selectedCategory.id;
  }

  compareBrand(brand: Brand, selectedBrand: Brand){
    return brand.id === selectedBrand.id;
  }
}
