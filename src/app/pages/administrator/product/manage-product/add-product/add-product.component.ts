import {Component, Inject, OnDestroy} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {Category} from "../../../../../core/product/category.interface";
import {Brand} from "../../../../../core/product/brand.interface";
import {Validator} from "../../../../../core/validator";
import {Observable, Subject} from "rxjs";
import {ProductService} from "../../../../../core/product/product.service";
import {
  MultipleFileUploadComponent
} from "../../../../../components/multiple-file-upload/multiple-file-upload.component";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {AlertService} from "../../../../../core/service/alert.service";
import {TuiDialogContext, TuiDialogService} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {FileService} from "../../../../../core/file/file.service";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    MultipleFileUploadComponent,
    ButtonComponent
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  addProductForm: FormGroup;
  categories$: Observable<Category[]>;
  brands$: Observable<Brand[]>;

  showLoading = false;

  constructor(private fb: FormBuilder, private productService: ProductService, private alertService: AlertService,
              @Inject(TuiDialogService) private readonly dialogs: TuiDialogService, @Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<boolean>, private fileService: FileService) {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required, Validator.noWhitespaceValidator], [Validator.createProductNameValidator(this.productService)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      stocks: this.fb.array([this.fb.group({
        size: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(1)]],
        length: [0, [Validators.required, Validators.min(1)]],
        width: [0, [Validators.required, Validators.min(1)]],
        height: [0, [Validators.required, Validators.min(1)]],
        weight: [0, [Validators.required, Validators.min(1)]],
      })]),
      image: this.fb.group({
        display_product: [null, Validators.required],
        product_details_showcase: [[], Validators.required]
      })
    });
    this.brands$ = this.productService.findAllProductBrands();
    this.categories$ = this.productService.findAllProductCategories();
  }

  get nameControl() {
    return this.addProductForm.controls['name'] as FormControl;
  }

  get descriptionControl() {
    return this.addProductForm.controls['description'] as FormControl;
  }

  get priceControl() {
    return this.addProductForm.controls['price'] as FormControl;
  }

  get quantityControl() {
    return this.addProductForm.controls['quantity'] as FormControl;
  }


  get categoryControl() {
    return this.addProductForm.controls['category'] as FormControl;
  }

  get brandControl() {
    return this.addProductForm.controls['brand'] as FormControl;
  }

  get productImageControl() {
    return this.addProductForm.controls['image'].get('display_product') as FormControl;
  }

  get stockFormArray() {
    return this.addProductForm.controls['stocks'] as FormArray;
  }

  get productGroupImageControl() {
    return this.addProductForm.controls['image'].get('product_details_showcase') as FormControl;
  }

  createProduct() {
    this.addProductForm.markAllAsTouched();
    if (this.addProductForm.valid) {
      this.showLoading = true;

      this.fileService.uploadProductFiles(this.productImageControl.getRawValue(), this.productGroupImageControl.getRawValue())
        .subscribe(files=>{
          const product = this.addProductForm.getRawValue();
          product['images'] = files;
          this.productService.save(product)
            .subscribe({
              next: res => {
                this.showLoading = false;
                this.context.completeWith(false);
                this.productService.reload();
                this.alertService.showSuccess(`Successfully added new product`);
              },
              error:err=> {
                this.showLoading = false;
                this.alertService.showError('Something went wrong, please try again later.')
              }
            });
        });
    }
  }

  addStockRow() {
    this.stockFormArray.markAllAsTouched();
    if (this.stockFormArray.valid) {
      this.stockFormArray.push(this.fb.group({
        size: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(1)]],
        length: [0, [Validators.required, Validators.min(1)]],
        width: [0, [Validators.required, Validators.min(1)]],
        height: [0, [Validators.required, Validators.min(1)]],
        weight: [0, [Validators.required, Validators.min(1)]]
      }))
    }
  }

  removeStockRow(i: number) {
    this.stockFormArray.removeAt(i);
  }

}
