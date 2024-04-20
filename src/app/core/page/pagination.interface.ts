import {Category} from "../product/category.interface";
import {Brand} from "../product/brand.interface";

export interface PageRequest{
  page:number;
  page_size:number;
  search: {attributes: string[], keyword:string};
  sort:string;
}
export interface Pageable<T>{
  items:T[];
  size:number;
  current_page:number;
  total_elements:number;
  has_next_page:boolean;
  has_previous_page:boolean;
}

export interface ProductPageRequest extends PageRequest{
  categories:Category[];
  brands:Brand[];
  min_quantity:string;
}



