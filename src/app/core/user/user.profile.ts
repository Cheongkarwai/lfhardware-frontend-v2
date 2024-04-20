import {Address} from "../order/order.interface";

export interface UserProfile{
  username:string;
  profile:{
    email_address:string | null;
    phone_number:string | null,
    address:Address
  },
}
