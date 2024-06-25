export interface AppointmentTable{
  index: number;
  id: string;
  service_provider_id:string;
  service_id: number;
  customer_id: string;
  created_at: Date;
  booking_datetime: Date;
  estimated_price: number;
  is_paid: boolean;
  status: string;
}
