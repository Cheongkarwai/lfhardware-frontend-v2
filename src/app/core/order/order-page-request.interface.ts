import {PageRequest} from "../page/pagination.interface";

export interface OrderPageRequest extends PageRequest{
  delivery_status:string;
}
