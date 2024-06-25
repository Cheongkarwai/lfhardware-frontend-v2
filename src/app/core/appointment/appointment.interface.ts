import {ContactInfo} from "../service-provider/service-provider-signup.service";
import {ServiceProvider} from "../service-provider/service-provider.interface";

export interface Appointment{
  id: string;
  service:{
    id: number;
    name: string;
  };
  customer:{
    id: string;
    name: string;
  };
  service_provider:ServiceProvider;
  created_at: Date;
  booking_datetime: Date;
  estimated_price: number;
  is_paid: boolean;
  status: string;
  completion_datetime: Date;
  confirmation_datetime: Date;
  job_started_datetime: Date;
  job_completion_datetime: Date;
  review_datetime: Date;
  status_last_update: Date;
  appointment_completion_images: AppointmentCompletionImage[];
}

export interface AppointmentCompletionImage{
  id: number;
  path: string;
}
