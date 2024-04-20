import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Order} from "./order.interface";
import {environment} from "../../../environments/environment.development";
import {Pageable, PageRequest} from "../page/pagination.interface";
import {CheckoutForm} from "../cart/checkout-form.interface";
import {OrderDetails} from "./order-details.interface";
import {OrderPageRequest} from "./order-page-request.interface";
import {Subject} from "rxjs";
import {OrderProduct} from "./order-product.interface";

@Injectable({
  providedIn:'root'
})
export class OrderService{

  private url = `${environment.api_url}/orders`;

  private refresh$ = new Subject<void>();

  constructor(private httpClient:HttpClient) {
  }

  findAll(pageRequest:OrderPageRequest){

    let httpParams = new HttpParams();

    if(pageRequest.page_size > 0){
      httpParams = httpParams.set('page',pageRequest.page);
      httpParams = httpParams.set('page_size',pageRequest.page_size);
    }

    if(pageRequest.search)  { httpParams = httpParams.set('keyword',pageRequest.search.keyword) };

    if(pageRequest.sort) { httpParams = httpParams.set('sort',pageRequest.sort) };

    if(pageRequest.delivery_status){ httpParams = httpParams.set('delivery_status',pageRequest.delivery_status)}

    return this.httpClient.get<Pageable<Order>>(this.url,{params:httpParams});
  }

  findAllOrderProducts(pageRequest:OrderPageRequest){
    let httpParams = new HttpParams();

    if(pageRequest.page_size > 0){
      httpParams = httpParams.set('page',pageRequest.page);
      httpParams = httpParams.set('page_size',pageRequest.page_size);
    }

    if(pageRequest.search)  { httpParams = httpParams.set('keyword',pageRequest.search.keyword) };

    if(pageRequest.sort) { httpParams = httpParams.set('sort',pageRequest.sort) };

    if(pageRequest.delivery_status){ httpParams = httpParams.set('delivery_status',pageRequest.delivery_status)}

    return this.httpClient.get<Pageable<OrderProduct>>(`${this.url}/products`,{params:httpParams});
  }

  findById(id:number){
    return this.httpClient.get<OrderDetails>(`${this.url}/${id}`);
  }

  createOrder(checkoutForm:CheckoutForm) {
    return this.httpClient.post<OrderDetails>(`${this.url}`,checkoutForm);
  }

  downloadOrderPDF(id: number){
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.post(`${this.url}/${id}/pdf`, {} , {headers: headers, responseType: 'blob', observe: 'response'});
  }

  partialUpdate(id:number, data:any) {
    return this.httpClient.patch(`${this.url}/${id}`,data);
  }

  get refresh(){
    return this.refresh$;
  }

  exportCsv() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept','application/csv')
    return this.httpClient.post(`${this.url}/csv`,{}, {headers: headers, responseType: 'blob', observe: 'response'})
  }

  count(){
    return this.httpClient.get<number>(`${this.url}/count`);
  }

  countDailyOrder(days: number) {

    let params = new HttpParams();
    params = params.set('days', days);

    return this.httpClient.get<{ day: never, total: number }[]>(`${this.url}/daily-order-count`, {params: params});
  }

  countDailySales(days: number) {

    let params = new HttpParams();
    params = params.set('days', days);

    return this.httpClient.get<{ day: never, total: number }[]>(`${this.url}/daily-sales`, {params: params});
  }
}
