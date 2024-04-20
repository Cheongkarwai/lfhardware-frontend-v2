import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {TUI_PROMPT, TuiInputModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TableComponent} from "../../../../components/table/table.component";
import {TuiTablePagination, TuiTablePaginationModule, tuiTablePaginationOptionsProvider} from "@taiga-ui/addon-table";
import {ProductService} from "../../../../core/product/product.service";
import {Pageable, ProductPageRequest} from "../../../../core/page/pagination.interface";
import {BehaviorSubject, map, Observable, startWith, Subject, switchMap, combineLatest} from "rxjs";
import {Product} from "../../../../core/product/product.interface";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {EditProductDialogComponent} from "./edit-product-dialog/edit-product-dialog.component";
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {AddProductComponent} from "./add-product/add-product.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AlertService} from "../../../../core/service/alert.service";

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TableComponent,
    TuiTablePaginationModule,
    LoadingSpinnerComponent,
    CommonModule,
    ButtonComponent,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  providers: [
    tuiTablePaginationOptionsProvider({
      showPages: false,
    }),
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
  columns = [
    {key: 'image', value: 'Image'},
    {key: 'name', value: 'Name'},
    {key: 'description', value: 'Description'},
    {key: 'price', value: 'Price (RM)'},
  ];

  pageRequest: ProductPageRequest = {
    page: 0,
    page_size: 25,
    search: {
      attributes : [],
      keyword : ''
    },
    sort: '',
    categories: [],
    brands: [],
    min_quantity: ''
  };

  productPageable$!: Observable<Pageable<Product>>;

  search = new FormControl('');

  menuItems = [
    {title: 'Edit', iconName: 'tuiIconEdit'},
    {title: 'Delete', iconName: 'tuiIconTrash'},
  ];
  pagination$: BehaviorSubject<ProductPageRequest> = new BehaviorSubject<ProductPageRequest>(this.pageRequest);

  constructor(private productService: ProductService, @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector, private alertService: AlertService) {

  }

  ngOnInit() {
    this.productPageable$ = combineLatest([this.pagination$.pipe(startWith(this.pageRequest)),this.search.valueChanges.pipe(startWith('')), this.productService.reloadSubject.pipe(startWith(''))])
      .pipe(switchMap(([pageRequest,search, reload]) => {
        if(search){
          pageRequest.search.keyword = search;
        }else{
          pageRequest.search.keyword = '';
        }
        return this.productService.findAll(pageRequest);
      }))
    // this.productService.reloadSubject.pipe(startWith(''),
    // switchMap(e => this.productService.findAll(this.pageRequest)));
  }

  edit(item: Product) {
    const dialog = this.dialogs
      .open(
        new PolymorpheusComponent(EditProductDialogComponent, this.injector),
        {
          size: 'page',
          closeable: true,
          dismissible: true,
        },
      )
      .subscribe();
  }

  delete(item: Product) {
    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        label: 'Are you sure you want to delete this product?',
        data: {
          content: 'This action is not reversible',
          yes: 'Delete now',
          no: 'Cancel',
        },
      })
      .subscribe(response => {
        // ...
      });
  }

  addProduct() {
    this.dialogs
      .open(
        new PolymorpheusComponent(AddProductComponent, this.injector),
        {
          size: 'page',
          closeable: true,
          dismissible: true,
        },
      )
      .subscribe();
  }

  handleContextMenu(event: { action: string, data: Product }) {
    switch (event.action) {
      case 'Edit':
        this.dialogs
          .open(
            new PolymorpheusComponent(EditProductDialogComponent, this.injector),
            {
              size: 'page',
              closeable: true,
              dismissible: true,
              data: event.data.id
            },
          )
          .subscribe();
        break;

      case 'Delete':

        this.productService.deleteById(event.data.id).subscribe({
          next: res => {
            this.productService.reload();
            this.alertService.showSuccess(`Product has been deleted`);
          },
          error: err => this.alertService.showError('Something went wrong. Please try again later')
        });
        break;
    }
  }

  changePagination(event: TuiTablePagination) {
    this.pageRequest.page = event.page;
    this.pageRequest.page_size = event.size;
    this.pagination$.next(this.pageRequest);
  }
}
