import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {CartItem} from "./cart-item.interface";
import {Cart} from "./cart.interface";
import {CheckoutForm} from "./checkout-form.interface";

@Injectable({
  providedIn:'root'
})
export class CartService{

  private url = `${environment.api_url}/carts`;

  constructor(private httpClient:HttpClient) {
  }

  addItem(item:{product_id:number,quantity:number, size:string}){
    return this.httpClient.post(`${this.url}/items`,item);
  }

  findCart(){
    return this.httpClient.get<Cart>(`${this.url}`);
  }

  removeCartItem(item: CartItem) {
    return this.httpClient.delete(`${this.url}/items/${item.cart_id}/${item.stock_id}`)
  }

  updateCartItemQuantity(stockId:number, cartId:number, quantity:number){
    return this.httpClient.put(`${this.url}/items/${cartId}/${stockId}`,{quantity:quantity})
  }


}
