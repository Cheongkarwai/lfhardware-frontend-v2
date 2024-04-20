import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {MonthlySales} from "./monthly-sales.interface";


@Injectable({
  providedIn:'root'
})
export class ReportService{

  private readonly url  = `${environment.api_url}/reports`;

  constructor(private httpClient: HttpClient) {
  }

  findMonthlySales(){
    return this.httpClient.get<MonthlySales[]>(`${this.url}/monthly-sales`);
  }
}
