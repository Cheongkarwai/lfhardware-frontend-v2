import {Validators} from "@angular/forms";
import {Validator} from "../validator";
import {Address, Recipient} from "../order/order.interface";
import {CartItem} from "./cart-item.interface";
import {CourierInput} from "../shipment/shipment.interface";

export interface CheckoutForm{
  courier:CourierInput
  recipient:Recipient,
  shipping_method:string,
  payment_method:string
  items:CartItem[];
  delivery_status:string;
  payment_status:string;
  shipping_fees:number;
  total:number;
  subtotal:number;
}

export interface ShippingMethod{
  id:number;
  method:string;
}

export interface Payment{
  id:number;
  method:string;
}
export interface PersonalInformation{
  first_name:string;
  last_name:string;
  phone_number:string;
  email_address:string;
}
