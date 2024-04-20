import {Validators} from "@angular/forms";
import {Recipient} from "../order/order.interface";

export interface CourierInput{
  service_id: string | null;
  courier_id: string | null;
  courier_name: string | null;
  courier_logo: string | null;
  fees:number | null;
}
