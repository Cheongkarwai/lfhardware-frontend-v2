import {CartItem} from "./cart-item.interface";

export interface Cart{
  subtotal:number;
  total:number;
  shipping_fees:number;
  tax_amount:number;
  items:CartItem[]
}
