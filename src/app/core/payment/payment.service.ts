import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {Pageable, PageRequest} from "../page/pagination.interface";
import {Payment} from "./payment.interface";

@Injectable({
  providedIn:'root'
})
export class PaymentService{

  private url = `${environment.api_url}/payments`;
  constructor(private httpClient: HttpClient) {
  }

  createPaymentIntents(paymentIntent : {amount:number, currency:string}){
    return this.httpClient.post<{client_secret:string, id:string}>(`${this.url}/payment-intents`,paymentIntent);
  }

  addPaymentIntentMetadata(id: string,map :any){
    return this.httpClient.patch(`${this.url}/payment-intents/${id}/metadata`,map);
  }

  createCheckoutSession(){
    return this.httpClient.post(`${this.url}/checkout`,{},{responseType:'text'});
  }

}
