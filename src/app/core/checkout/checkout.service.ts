import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn:'root'
})
export class CheckoutService{

  private url = `${environment.api_url}/checkout`;

  constructor(private httpClient:HttpClient) {}
  createCheckoutSession(){
    return this.httpClient.post(`${this.url}/sessions`, {}, {responseType:'text'});
  }
}
