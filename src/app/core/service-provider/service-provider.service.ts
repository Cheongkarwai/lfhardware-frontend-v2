import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServiceProvider} from "./service-provider.interface";
import {ServiceProviderRequest} from "./service-provider-request.interface";
import {Pageable} from "../page/pagination.interface";
import {ServiceProviderDetails} from "./service-provider-details";
import {Observable, Subject} from "rxjs";
import {FormConfiguration} from "../form/form-configuration.interface";

@Injectable({
  providedIn:'root'
})
export class ProviderService{

  private url = `${environment.api_url}/service-providers`;

  private refresh$ = new Subject<void>();

  constructor(private httpClient:HttpClient) {
  }
  findAll(pageRequest:ServiceProviderRequest){

    let httpParams = new HttpParams();

    if(pageRequest.page_size > 0){
      httpParams = httpParams.set('page',pageRequest.page);
      httpParams = httpParams.set('page_size',pageRequest.page_size);
    }

    if(pageRequest.search.keyword)  {
      for(const attribute of pageRequest.search.attributes){
       httpParams = httpParams.append('search', attribute);
      }
      httpParams = httpParams.set('keyword',pageRequest.search.keyword)
    };

    if(pageRequest.sort) { httpParams = httpParams.set('sort',pageRequest.sort) };

    if(pageRequest.min_price){
      httpParams = httpParams.set('min_price',pageRequest.min_price);
    }

    if(pageRequest.max_price){
      httpParams = httpParams.set('max_price',pageRequest.max_price);
    }

    if(pageRequest.service_name){
      httpParams = httpParams.set('service_name',pageRequest.service_name);
    }

    if(pageRequest.states.length > 0){
      for(const state of pageRequest.states){
        httpParams = httpParams.append('state',state);
      }
    }

    if(pageRequest.rating.length > 0){
      for(const rating of pageRequest.rating){
        httpParams = httpParams.append('rating',rating);
      }
    }

    if(pageRequest.status){
      httpParams = httpParams.set('status', pageRequest.status);
    }

    return this.httpClient.get<Pageable<ServiceProvider>>(this.url,{params:httpParams})
  }

  findById(id:number){
    return this.httpClient.get<ServiceProviderDetails>(`${this.url}/details/${id}`);
  }

  findAllDetails(pageRequest: ServiceProviderRequest) {
    let httpParams = new HttpParams();

    if(pageRequest.page_size > 0){
      httpParams = httpParams.set('page',pageRequest.page);
      httpParams = httpParams.set('page_size',pageRequest.page_size);
    }

    if(pageRequest.search)  { httpParams = httpParams.set('keyword',pageRequest.search.keyword) };

    if(pageRequest.sort) { httpParams = httpParams.set('sort',pageRequest.sort) };

    if(pageRequest.min_price){
      httpParams = httpParams.set('min_price',pageRequest.min_price);
    }

    if(pageRequest.max_price){
      httpParams = httpParams.set('max_price',pageRequest.max_price);
    }

    if(pageRequest.service_name){
      httpParams = httpParams.set('service_name',pageRequest.service_name);
    }

    if(pageRequest.states.length > 0){
      for(const state of pageRequest.states){
        httpParams = httpParams.append('state',state);
      }
    }

    if(pageRequest.rating.length > 0){
      for(const rating of pageRequest.rating){
        httpParams = httpParams.append('rating',rating);
      }
    }

    if(pageRequest.status){
      httpParams = httpParams.set('status', pageRequest.status);
    }

    return this.httpClient.get<Pageable<ServiceProviderDetails>>(`${this.url}/details`,{params:httpParams})
  }

  patch(id:number, data:any){
    return this.httpClient.patch(`${this.url}/${id}`,data);
  }

  get refresh(){
    return this.refresh$;
  }

  updateStatus(id: number, data:any) {
    return this.httpClient.put(`${this.url}/${id}/status`, data);
  }

  findServiceProviderForm(serviceProviderId: number, serviceId: number){
    return this.httpClient.get<FormConfiguration>(`${this.url}/${serviceProviderId}/services/${serviceId}/forms`)
  }
}
