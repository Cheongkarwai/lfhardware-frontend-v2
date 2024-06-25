import {PageRequest} from "../page/pagination.interface";
import {State} from "../state/state.interface";

export interface ServiceProviderRequest extends PageRequest{
  min_price:number;
  max_price:number;
  rating:{min:number, max:number}[];
  service_name:string;
  states:string[];
  //status:string;
}
