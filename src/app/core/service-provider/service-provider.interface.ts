import {ContactInfo} from "./service-provider-signup.service";

export interface ServiceProvider{
  id:number;
  name:string;
  is_verified:boolean;
  contact_info:ContactInfo
  rating:number;
}
