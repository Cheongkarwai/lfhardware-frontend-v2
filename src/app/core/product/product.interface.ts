import {Brand} from "./brand.interface";
import {Category} from "./category.interface";
import {Image} from "../file/image.interface";
import {Review} from "../review/review.interface";

export interface Product{
  id:number;
  name:string;
  price:number;
  description:string;
  brand:Brand;
  category:Category;
  stocks:Stock[];
  product_images:Image[];
  reviews: Review[];
}

export interface Stock{
  available_quantity:number;
  size:string;
  length:number;
  height:number;
  width:number;
  weight:number;
}
