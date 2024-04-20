import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Country} from "./country.interface";

@Injectable({
  providedIn:'root'
})
export class CountryService {

  private url = `${environment.api_url}/countries`;

  constructor(private httpClient:HttpClient) {}
  findAll(){
    return this.httpClient.get<Country[]>(this.url);
  }
}
