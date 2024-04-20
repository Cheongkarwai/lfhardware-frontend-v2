export interface Payment{
  id:number;
  customer_name:string;
  shipping_fees:number;
  tax_amount:number;
  total:number;
  subtotal:number;
  created_at:Date;
  order_id:number;
}
