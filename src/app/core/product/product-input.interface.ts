import {Brand} from "./brand.interface";
import {Category} from "./category.interface";
import {Image} from "../file/image.interface";

export interface ProductInput{
  name:string;
  description:string;
  price:number;
  brand:Brand;
  category:Category;
  stocks:StockInput[];
  images:Image[];
  // image:{
  //   display_product: File,
  //   product_details_showcase: File[]
  // }
}

export interface StockInput{
  size:string;
  quantity:number;
}
