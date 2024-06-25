import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {Service} from "./service.interface";
import {ServiceCategory} from "./service-category.interface";
import {BehaviorSubject, shareReplay} from "rxjs";
import {ServiceDetails} from "./service-details.interface";

@Injectable({
  providedIn:'root'
})
export class ProviderBusinessService{

  private url = `${environment.api_url}/services`

  private serviceCategories$ = new BehaviorSubject<ServiceCategory[]>([]);
  constructor(private httpClient:HttpClient){}

  findAllServices(){
    //this.httpClient.get<ServiceCategory[]>(this.url).subscribe(res=> this.serviceCategories$.next(res));
    return this.httpClient.get<ServiceCategory[]>(this.url).pipe(shareReplay());
  }

  get serviceCategoriesObs(){
    return this.serviceCategories$.asObservable();
  }


  findDetailsById(id: number) {
    return this.httpClient.get<ServiceDetails>(`${this.url}/${id}/details`);
  }
}
