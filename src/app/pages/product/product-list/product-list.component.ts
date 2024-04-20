import {Component, Inject, Injector, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "../../../components/breadcrumb/breadcrumb.component";
import {TuiInputModule, TuiMultiSelectModule, TuiPaginationModule} from "@taiga-ui/kit";
import {TuiDataListModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler} from "@taiga-ui/cdk";
import {ProductService} from "../../../core/product/product.service";
import {Pageable, PageRequest, ProductPageRequest} from "../../../core/page/pagination.interface";
import {BehaviorSubject, combineLatest, map, Observable, share, startWith, Subject, switchMap} from "rxjs";
import {Product} from "../../../core/product/product.interface";
import {Category} from "../../../core/product/category.interface";
import {Brand} from "../../../core/product/brand.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {MathCeilPipe} from "../../../core/pipe/math-ceil.pipe";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {ProductQuickviewComponent} from "./product-quickview/product-quickview.component";
import {DialogSubscriptionService} from "../../../core/dialog/dialog.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent,
    TuiInputModule,
    TuiMultiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    ReactiveFormsModule,
    FaIconComponent,
    TuiPaginationModule,
    MathCeilPipe,
    LoadingSpinnerComponent,
    ButtonComponent,
    ProductQuickviewComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Directory',
      routerLink: ''
    },
  ];
  readonly items: readonly Hero[] = [
    {id: 1, name: 'Luke Skywalker'},
    {id: 2, name: 'Leia Organa Solo'},
    {id: 3, name: 'Darth Vader'},
    {id: 4, name: 'Han Solo'},
    {id: 5, name: 'Obi-Wan Kenobi'},
    {id: 6, name: 'Yoda'},
  ];

  readonly control = new FormControl('',Validators.required);

  readonly stringify: TuiStringHandler<Hero | TuiContextWithImplicit<Hero>> = item =>
    'name' in item ? item.name : item.$implicit.name;

  readonly identityMatcher: TuiIdentityMatcher<Hero> = (hero1, hero2) =>
    hero1.id === hero2.id;

  pageRequest:ProductPageRequest = {
    page:0,
    page_size:25,
    search:{
      attributes : [],
      keyword : ''
    },
    sort:'',
    categories:[],
    brands:[],
    min_quantity: ""
  };

  productPageable$!:Observable<Pageable<Product>>;
  categories$!:Observable<Category[]>;
  brands$!:Observable<Brand[]>;

  filterForm!:FormGroup;

  protected readonly faMagnifyingGlass = faMagnifyingGlass;

  isCategoryFilterOpen: boolean = false;
  isBrandFilterOpen: boolean = false;
  isSortFilterOpen:boolean = false;

  selectedData!:Product;
  isMobileCanvasMenuOpen: boolean = false;

  isBrandFilterSectionVisible: boolean = false;
  isCategoryFilterSectionVisible: boolean = false;

  filter$ = new Subject<void>();

  brandsFilter$ = new BehaviorSubject<Brand[]>([]);
  categoriesFilter$ = new BehaviorSubject<Category[]>([]);

  pagination$ = new BehaviorSubject<ProductPageRequest>(this.pageRequest);

  totalElements: number = 0;

  constructor(private productService:ProductService, private fb:FormBuilder, @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector, private dialogSubscriptionService: DialogSubscriptionService) {}

  ngOnInit() {
    this.productPageable$ = combineLatest([this.brandsFilter$.pipe(startWith([])), this.categoriesFilter$.pipe(startWith([])),
    this.productService.getBrandFilter(), this.productService.getCategoryFilter(), this.pagination$.pipe(startWith(this.pageRequest))])
      .pipe(switchMap(([brands, categories, brandFromHome, categoryFromHome, pageRequest])=>{
        pageRequest.categories = categories;
        pageRequest.brands = brands;

        if(brandFromHome){
          pageRequest.brands = [brandFromHome];
        }
        if(categoryFromHome){
          pageRequest.categories = [categoryFromHome];
        }
        return this.productService.findAll(pageRequest).pipe(map(productPageable=> {
          productPageable.items.map(product=>{
            this.totalElements = productPageable.total_elements || 0;
            product.product_images = product.product_images.filter(image=> image.type === 'productImage');
            return product;
          })
          return productPageable;
        }));
    }));
    this.brands$ = this.productService.findAllProductBrands()
      .pipe(map(brands=>{
        brands.forEach(brand=> this.brandsFormArray.push(this.fb.group({
          brand:[brand],
          selected: [false],
        })))
        return brands;
      }));
    this.categories$ = this.productService
      .findAllProductCategories().pipe(map(categories=>{
        categories.forEach(category=> this.categoriesFormArray.push(this.fb.group({
          category: [category],
          selected: [false]
        })));
        return categories;
      }));

    this.filterForm = this.fb.group({
      search:[''],
      categories:this.fb.array([]),
      brands:this.fb.array([])
    });

  }

  findProducts() {
    // this.pageRequest.categories = this.filterForm.controls['categories'].getRawValue();
    // this.pageRequest.brands = this.filterForm.controls['brands'].getRawValue();
    // this.pageRequest.search = this.filterForm.controls['search'].getRawValue();
    // this.productPageable$  = this.productService.findAll(this.pageRequest);
  }

  fetchPage(page: number) {
    this.pageRequest.page = page;
    this.pagination$.next(this.pageRequest);
    // console.log(this.filterForm.controls['categories'].getRawValue());
    // this.findProducts();
  }

  get categoriesFormArray(){
    return this.filterForm.controls['categories'] as FormArray;
  }

  get brandsFormArray(){
    return this.filterForm.controls['brands'] as FormArray;
  }

  toggleBrandFilter() {
    this.isCategoryFilterOpen = false;
    this.isBrandFilterOpen = !this.isBrandFilterOpen;
  }

  toggleCategoryFilter() {
    this.isBrandFilterOpen = false;
    this.isCategoryFilterOpen = !this.isCategoryFilterOpen;
  }

  toggleSortFilter(){
    this.isSortFilterOpen = !this.isSortFilterOpen;
  }
  quickView(product:Product) {
    this.selectedData = product;
    this.dialogSubscriptionService.showQuickViewDialog = true;
  }

  openMobileCanvas() {
    this.isMobileCanvasMenuOpen = true;
  }

  closeMobileCanvasMenu() {
    this.isMobileCanvasMenuOpen = false;
  }

  toggleBrandFilterSection() {
    this.isBrandFilterSectionVisible = !this.isBrandFilterSectionVisible;
  }

  toggleCategoryFilterSection(){
    this.isCategoryFilterSectionVisible = !this.isCategoryFilterSectionVisible;
  }

  applyFilter() {
    this.categoriesFilter$.next(this.categoriesFormArray.getRawValue().filter(category => category['selected'] === true).map(category=> category['category']));
    this.brandsFilter$.next(this.brandsFormArray.getRawValue().filter(brand=> brand['selected'] === true).map(brand=>brand['brand']));
    //this.categoriesFilter$.next();
    this.isBrandFilterOpen = false;
    this.isCategoryFilterOpen = false;
    this.isMobileCanvasMenuOpen = false;
    this.isBrandFilterSectionVisible = false;
    this.isCategoryFilterSectionVisible = false;
  }

  resetFilter() {
    this.brandsFilter$.next([]);
    this.categoriesFilter$.next([]);

    this.productService.setBrandFilter(null);
    this.productService.setCategoryFilter(null);
    for(let i = 0;i < this.brandsFormArray.length; i++){
      this.brandsFormArray.at(i).get('selected')?.setValue(false);
    }
  }

  previousPage() {
    if(this.pageRequest.page > 0) {
      this.pageRequest.page--;
      this.pagination$.next(this.pageRequest);
    }
  }

  nextPage() {
    if(this.totalElements > 0){
      console.log(Math.ceil(this.totalElements / this.pageRequest.page_size));
      if((this.pageRequest.page + 1) !== Math.ceil(this.totalElements/this.pageRequest.page_size)){
        this.pageRequest.page++;
        this.pagination$.next(this.pageRequest);
      }
    }
  }
}

export interface Hero{
  id:number;
  name:string;
}
