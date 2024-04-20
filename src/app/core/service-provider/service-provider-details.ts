import {ContactInfo} from "./service-provider-signup.service";
import {Service} from "./service.interface";

export interface ServiceProviderDetails{
  id:number;
  name:string;
  is_verified:boolean;
  contact_info:ContactInfo
  rating:number;
  services:Service[];
  overview:string;
  state_coverages:string[],
  country_coverages:string[],
  city_coverages:string[]
  status:string;
  created_at:Date;
}
