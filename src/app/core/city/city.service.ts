import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {City} from "./city.interface";

@Injectable({
  providedIn:'root'
})
export class CityService{

  private url = `${environment.api_url}/cities`;

  constructor(private httpClient:HttpClient) {}
  findAll(){
    return this.httpClient.get<City[]>(this.url);
  }
}
