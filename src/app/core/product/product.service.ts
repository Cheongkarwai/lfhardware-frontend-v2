import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Pageable, PageRequest, ProductPageRequest} from "../page/pagination.interface";
import {environment} from "../../../environments/environment.development";
import {Product} from "./product.interface";
import {Category} from "./category.interface";
import {Brand} from "./brand.interface";
import {ProductInput} from "./product-input.interface";
import {BehaviorSubject, ReplaySubject, startWith, Subject} from "rxjs";
import {Image} from "../file/image.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly url = `${environment.api_url}/products`;

  private reload$ = new Subject<void>();

  private categoryFilter$: ReplaySubject<Category | null> = new ReplaySubject<Category | null>(1);

  private brandFilter$: ReplaySubject<Brand | null> = new ReplaySubject<Brand | null>(1);

  constructor(private httpClient: HttpClient) {
  }

  findAll(pageRequest: ProductPageRequest) {

    let httpParams = new HttpParams();

    if (pageRequest.page_size > 0) {
      httpParams = httpParams.set('page', pageRequest.page);
      httpParams = httpParams.set('page_size', pageRequest.page_size);
    }

    if (pageRequest.search.keyword) {
      for(let attribute of pageRequest.search.attributes){
        httpParams = httpParams.set('attribute', attribute);
      }
      httpParams = httpParams.set('keyword', pageRequest.search.keyword)
    }
    ;

    if (pageRequest.sort) {
      httpParams = httpParams.set('sort', pageRequest.sort)
    }
    ;

    if (pageRequest.categories.length > 0) {
      for (const category of pageRequest.categories) {
        httpParams = httpParams.append('categories', category.id);
      }
    }
    if (pageRequest.brands.length > 0) {
      for (const brand of pageRequest.brands) {
        httpParams = httpParams.append('brands', brand.id);
      }
    }

    if (pageRequest.min_quantity) {
      httpParams = httpParams.set('min_quantity', pageRequest.min_quantity);
    }

    return this.httpClient.get<Pageable<Product>>(this.url, {params: httpParams});
  }

  findById(selectedId: number) {
    return this.httpClient.get<Product>(`${this.url}/${selectedId}`);
  }

  findAllProductCategories() {
    return this.httpClient.get<Category[]>(`${this.url}/categories`);
  }

  findAllProductBrands() {
    return this.httpClient.get<Brand[]>(`${this.url}/brands`)
  }

  save(product: ProductInput) {

    // const formData = new FormData();
    // const {name,description,price,brand,category, image, stocks} = product;
    // formData.set('product', JSON.stringify({name:name, description:description, price:price, brand:brand, category: category, stocks: stocks}));
    // formData.set('product_image', image.display_product);
    // for(const productDetailsImage of image.product_details_showcase){
    //   formData.append('product_details_images', productDetailsImage);
    // }

    return this.httpClient.post(this.url, product);
  }

  findByName(name: string) {
    return this.httpClient.get<Product>(`${this.url}/name/${name}`, {observe: 'response'});
  }

  deleteById(id: number) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  get reloadSubject() {
    return this.reload$;
  }

  reload() {
    this.reload$.next();
  }

  update(id: number, product: ProductInput) {
    // const formData = new FormData();
    // const {name,description,price,brand,category, image, stocks} = product;
    // formData.set('product', JSON.stringify({name:name, description:description, price:price, brand:brand, category: category, stocks: stocks}));
    // formData.set('product_image', image.display_product);
    // for(const productDetailsImage of image.product_details_showcase){
    //   formData.append('product_details_images', productDetailsImage);
    // }

    return this.httpClient.put(`${this.url}/${id}`, product);
  }

  setCategoryFilter(category: Category | null) {
    this.categoryFilter$.next(category);
  }

  setBrandFilter(brand: Brand | null) {
    this.brandFilter$.next(brand);
  }

  getCategoryFilter() {
    return this.categoryFilter$.asObservable().pipe(startWith(null));
  }

  getBrandFilter() {
    return this.brandFilter$.asObservable().pipe(startWith(null));
  }
}
