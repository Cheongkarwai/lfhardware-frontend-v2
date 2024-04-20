import {OrderItem} from "./order_item.interface";
import {ShippingDetails} from "./order-details.interface";

export interface OrderProduct{
  id:number;
  subtotal:number;
  total:number;
  shipping_fees:number;
  delivery_status:string;
  payment_status:string;
  items:OrderItem[];
}
