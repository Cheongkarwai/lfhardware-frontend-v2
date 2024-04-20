import {Address} from "../order/order.interface";
import {Role} from "./role.interface";

export interface UserAccount{
  username:string;
  password:string;
  profile:{
    email_address:string | null;
    phone_number:string | null,
    address:Address
  },
  email_verified:boolean;
  roles:  Role[];
  disabled:boolean;
}


