export interface Transaction{
  id:string;
  charge_amount:number;
  created_at:Date;
  currency:string;
  payment_method:string;
  status:string;
  order_id:number;
}
