import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {State} from "./state.interface";

@Injectable({
  providedIn:'root'
})
export class StateService{

  private url = `${environment.api_url}/states`;

  constructor(private httpClient:HttpClient) {}
  findAll(){
    return this.httpClient.get<State[]>(this.url);
  }
}
