export interface AvailableShipment{
  addon_insurance_available: boolean;
  addon_price:boolean;
  basic_insurance_currency: string;
  basic_insurance_max_value : number;
  cod_charges_calculation: string;
  cod_service_available: boolean;
  cod_service_max_cod_amount: number;
  cod_service_min_cod_amount: number;
  courier_id: string;
  courier_logo:string;
  courier_name:string;
  covered_by_insure_plus:boolean;
  delivery: string;
  dropoff_point:[],
  pickup_date: Date;
  pickup_point:[],
  price:number;
  rate_id: string;
  require_min_order:number;
  scheduled_start_date: string;
  service_detail:string;
  service_id:string;
  service_name:string;
  service_type:string;
  shipment_price:number;
  whatsapp_tracking_available: boolean;
  whatsapp_tracking_price: boolean;
}
