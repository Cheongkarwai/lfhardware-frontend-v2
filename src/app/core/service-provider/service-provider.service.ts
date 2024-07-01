import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ServiceProvider} from "./service-provider.interface";
import {ServiceProviderRequest} from "./service-provider-request.interface";
import {Pageable, PageRequest} from "../page/pagination.interface";
import {ServiceProviderDetails, ServiceProviderReview} from "./service-provider-details";
import {Observable, Subject} from "rxjs";
import {FormConfiguration} from "../form/form-configuration.interface";
import {Service} from "./service.interface";
import {Appointment} from "../appointment/appointment.interface";
import {BasicInfoForm, DocumentAndCredentialsForm} from "./service-provider-signup.service";
import {Image} from "../file/image.interface";
import {ServiceProviderInput} from "./service-provider-input.interface";
import {ReviewInput} from "../review/review-input.interface";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private url = `${environment.api_url}/service-providers`;

  private refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {
  }

  findAll(pageRequest: PageRequest, status: string[], ratings: string[], serviceName: | null, states: string[]) {

    let httpParams = new HttpParams();

    if (pageRequest.page_size > 0) {
      httpParams = httpParams.set('page', pageRequest.page);
      httpParams = httpParams.set('page_size', pageRequest.page_size);
    }

    if (pageRequest.search.keyword) {
      for (const attribute of pageRequest.search.attributes) {
        httpParams = httpParams.append('search', attribute);
      }
      httpParams = httpParams.set('keyword', pageRequest.search.keyword)
    }

    if (pageRequest.sort) {
      httpParams = httpParams.set('sort', pageRequest.sort)
    }


    if (serviceName) {
      httpParams = httpParams.set('service_name', serviceName);
    }

    if (states.length > 0) {
      for (const state of states) {
        httpParams = httpParams.append('state', state);
      }
    }

    if (ratings.length > 0) {
      for (const rating of ratings) {
        httpParams = httpParams.append('rating', rating);
      }
    }

    if (status.length > 0) {
      for (const stat of status) {
        httpParams = httpParams.append('status', stat);
      }
    }

    return this.httpClient.get<Pageable<ServiceProvider>>(this.url, {params: httpParams})
  }

  findById(id: string) {
    return this.httpClient.get<ServiceProviderDetails>(`${this.url}/details/${id}`);
  }

  findAllDetails(pageRequest: ServiceProviderRequest) {
    let httpParams = new HttpParams();

    if (pageRequest.page_size > 0) {
      httpParams = httpParams.set('page', pageRequest.page);
      httpParams = httpParams.set('page_size', pageRequest.page_size);
    }

    if (pageRequest.search) {
      httpParams = httpParams.set('keyword', pageRequest.search.keyword)
    }
    ;

    if (pageRequest.sort) {
      httpParams = httpParams.set('sort', pageRequest.sort)
    }
    ;

    if (pageRequest.min_price) {
      httpParams = httpParams.set('min_price', pageRequest.min_price);
    }

    if (pageRequest.max_price) {
      httpParams = httpParams.set('max_price', pageRequest.max_price);
    }

    if (pageRequest.service_name) {
      httpParams = httpParams.set('service_name', pageRequest.service_name);
    }

    if (pageRequest.states.length > 0) {
      for (const state of pageRequest.states) {
        httpParams = httpParams.append('state', state);
      }
    }

    // if (pageRequest.rating.length > 0) {
    //   for (const rating of pageRequest.rating) {
    //     httpParams = httpParams.append('rating', rating);
    //   }
    // }

    // if (pageRequest.status) {
    //   httpParams = httpParams.set('status', pageRequest.status);
    // }

    return this.httpClient.get<Pageable<ServiceProviderDetails>>(`${this.url}/details`, {params: httpParams})
  }

  patch(id: number, data: any) {
    return this.httpClient.patch(`${this.url}/${id}`, data);
  }


  get refresh() {
    return this.refresh$;
  }

  updateStatus(id: string, data: any) {
    return this.httpClient.put(`${this.url}/${id}/status`, data);
  }

  findServiceProviderForm(serviceProviderId: string, serviceId: number) {
    return this.httpClient.get<{
      service_provider_id: string,
      service_id: number,
      configuration: { elements: any[] }
    }>(`${this.url}/${serviceProviderId}/services/${serviceId}/forms`)
  }

  findServiceProviderServices() {
    return this.httpClient.get<Service[]>(`${this.url}/services`);
  }


  findServiceProviderFormByServiceId(serviceId: number) {
    return this.httpClient.get<{ configuration: { elements: any[] } }>(`${this.url}/services/${serviceId}/forms`)
  }

  findServiceProviderAppointments(pageRequest: PageRequest, statuses: string[]) {
    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('page_size', pageRequest.page_size);
    if (pageRequest.search.keyword && pageRequest.search.attributes.length > 0) {
      for (const attribute of pageRequest.search.attributes) {
        params = params.append('search', attribute);
      }
      params = params.set('keyword', pageRequest.search.keyword);
    }
    if (statuses.length > 0) {
      for (const status of statuses) {
        params = params.append('status', status);
      }
    }
    return this.httpClient.get<Pageable<Appointment>>(`${this.url}/appointments`, {params: params});
  }

  save(serviceProvider: { basic_information: BasicInfoForm | null }) {
    return this.httpClient.post<void>(`${this.url}`, serviceProvider);
  }

  findCurrentServiceProvider() {
    return this.httpClient.get<ServiceProvider>(`${this.url}/me`);
  }

  findServiceProviderReviewById(id: string, pageRequest: PageRequest, rating: string | null) {

    let params = new HttpParams();

    if (pageRequest.page_size > 0) {
      params = params.set('page', pageRequest.page);
      params = params.set('page_size', pageRequest.page_size);
    }

    if (pageRequest.search.keyword) {
      for (const attribute of pageRequest.search.attributes) {
        params = params.append('search', attribute);
      }
      params = params.set('keyword', pageRequest.search.keyword)
    }

    if (pageRequest.sort) {
      params = params.set('sort', pageRequest.sort)
    }
    if(rating){
      params = params.set('rating', rating);
    }

    return this.httpClient.get<Pageable<ServiceProviderReview>>(`${this.url}/${id}/reviews`, {params: params});
  }

  countServiceProviderReviewById(id: string) {
    return this.httpClient.get<number>(`${this.url}/${id}/reviews/count`);
  }

  countCurrentProviderReviews() {
    return this.httpClient.get<{rating: string, total: number}[]>(`${this.url}/me/reviews/count`);
  }

  countCurrentProviderAppointments(status: string, day: number) {
    let params = new HttpParams();
    if(status){
      params = params.set('status', status);
    }
    if(day > 0){
      params = params.set('day', day);
    }
    return this.httpClient.get<{ day: never, total: number }[]>(`${this.url}/me/appointments/count`, {params: params});
  }

  countServiceProvider(day: number) {
    let params = new HttpParams();
    if(day > 0){
      params = params.set('day', day);
    }
    return this.httpClient.get<{ day: never, total: number }[]>(`${this.url}/count`, {params: params});
  }

  findServiceProviderServicesById(serviceProviderId: string) {
    return this.httpClient.get<Service[]>(`${this.url}/${serviceProviderId}/services`);
  }

  findPaymentAccountStatus() {
    return this.httpClient.get<boolean>(`${this.url}/me/payment-accounts/status`);
  }

  updateById(serviceProviderId: string, serviceProvider: ServiceProviderInput) {
    return this.httpClient.put<void>(`${this.url}/${serviceProviderId}`, serviceProvider);
  }

  createPaymentAccount() {
    return this.httpClient.post(`${this.url}/me/payment-accounts`, {}, {responseType: 'text'});
  }

  saveReview(id: string, serviceId: number, serviceProviderId: string, customerId: string, createdAt: Date, input: ReviewInput){
    return this.httpClient.post<void>(`${this.url}/${id}/appointments/${serviceId}/${serviceProviderId}/${customerId}/${createdAt}/reviews`, input);
  }
}
