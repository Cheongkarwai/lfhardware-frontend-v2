import {Recipient} from "./order.interface";
import { OrderItem} from "./order_item.interface";

export interface OrderDetails{
  id:number;
  subtotal:number;
  total:number;
  shipping_fees:number;
  delivery_status:string;
  payment_status:string;
  shipping_details:ShippingDetails;
  items:OrderItem[];
  created_at:Date;
}

export interface ShippingDetails{
  id:number;
  recipient:Recipient;
}
