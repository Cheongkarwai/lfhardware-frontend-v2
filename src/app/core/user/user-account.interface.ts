import {Address} from "../order/order.interface";
import {Role} from "./role.interface";

export interface UserAccount{
  id: string;
  username:string;
  password:string;
  email: string;
  first_name: string;
  last_name: string;
  email_verified:boolean;
  profile:{
    email_address:string | null;
    phone_number:string | null,
    address:Address
  },
  roles:  Role[];
  disabled:boolean;
  first_time_login: boolean;
}


