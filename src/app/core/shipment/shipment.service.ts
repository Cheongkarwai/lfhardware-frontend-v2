import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {RateCheckInput} from "./rate-check.interface";
import {AvailableShipment} from "./available-shipment.interface";
import {EasyParcelResponse} from "./easy-parcel-response.interface";


@Injectable({
  providedIn:'root'
})
export class ShipmentService{

  private readonly url = `${environment.api_url}/shipments`;

  constructor(private httpClient: HttpClient) {
  }

  getAllAvailableShipment(rateCheckInput: RateCheckInput){
    return this.httpClient.post<EasyParcelResponse<AvailableShipment>>(this.url, {
      "bulk" : [rateCheckInput]
    });
  }

  getStateCode(state:string){

    let stateCode:string = '';

    switch (state){
      case "a":

        stateCode = 'sgr';
    }

    return stateCode;
  }
}
