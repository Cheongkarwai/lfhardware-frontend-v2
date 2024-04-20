import {Service} from "./service.interface";

export interface ServiceProvider{
  name:string;
  description:string;
  address:string;
  contact_info:{
    email_address:string;
    phone_number:string;
    whatsapp:string;
  };
  bank_details:{
    bank:string;
    full_name:string;
    account_number:string;
  },
  social_media_link:{
    facebook:string;
    instagram:string;
    tiktok:string;
  },
  album:{
    name:string;
    description:string;
    photos:string[]
  },
  coverage:{
    countries:string[];
    states:string[];
    cities:string[];
  },
  type_of_services:Service[];
}
