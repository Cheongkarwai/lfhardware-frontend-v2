import {Service} from "./service.interface";

export interface ServiceCategory{
  id:number;
  name:string;
  services:Service[];
}
