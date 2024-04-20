export interface Order{
  id:number;
  subtotal:number;
  total:number;
  shipping_fees:number;
  delivery_status:string;
  payment_status:string;
  recipient:Recipient;
}

export interface Recipient{
  first_name:string;
  last_name:string;
  phone_number:string;
  email_address:string;
  delivery_address:Address;
}

export interface Address{
  address_line_1:string;
  address_line_2:string;
  state:string;
  city:string;
  zipcode:string;
  country:string;
}
