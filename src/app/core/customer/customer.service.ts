import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Customer, CustomerInput} from "./customer.interface";
import {Pageable, PageRequest} from "../page/pagination.interface";
import {Appointment} from "../appointment/appointment.interface";
import {Subject} from "rxjs";

@Injectable({
  providedIn:'root'
})
export class CustomerService{

  private url = `${environment.api_url}/customers`;

  private refresh$: Subject<void> = new Subject<void>();

  constructor(private httpClient: HttpClient) {
  }
  findById(id: string){
    return this.httpClient.get<Customer>(`${this.url}/${id}`);
  }

  save(customer: CustomerInput){
    return this.httpClient.post<void>(`${this.url}`, customer);
  }

  findCurrentCustomer() {
    return this.httpClient.get<Customer>(`${this.url}/me`);
  }

  findCurrentCustomerAppointments(pageRequest: PageRequest, bookingDateTime: Date | null, status: string[]) {
    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('page_size', pageRequest.page_size);
    if(pageRequest.sort){
      params = params.set('sort', pageRequest.sort);
    }
    if(bookingDateTime){
      params = params.set('bookingDateTime', bookingDateTime.toISOString());
    }
    if(status.length > 0){
      for(const stat of status){
        params = params.append('status', stat);
      }
    }
    return this.httpClient.get<Pageable<Appointment>>(`${this.url}/me/appointments`, {params: params});
  }

  findAll(pageRequest: PageRequest) {
    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('page_size', pageRequest.page_size);
    if(pageRequest.sort){
      params = params.set('sort', pageRequest.sort);
    }
    if (pageRequest.search.keyword && pageRequest.search.attributes.length > 0) {
      for (const attribute of pageRequest.search.attributes) {
        params = params.append('search', attribute);
      }
      params = params.set('keyword', pageRequest.search.keyword);
    }
    return this.httpClient.get<Pageable<Customer>>(`${this.url}`, {params: params});
  }

  findCustomerAppointmentsById(pageRequest: any, customerId: string) {
    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('page_size', pageRequest.page_size);
    if(pageRequest.sort){
      params = params.set('sort', pageRequest.sort);
    }
    return this.httpClient.get<Pageable<Appointment>>(`${this.url}/${customerId}/appointments`, {params: params});
  }

  findCurrentCustomerAppointmentById(serviceId: number, serviceProviderId: string, createdAt: string){
    return this.httpClient.get<Appointment>(`${this.url}/me/appointments/${serviceId}/${serviceProviderId}/${createdAt}`)
  }

  update(id: string, input: CustomerInput) {
    return this.httpClient.put<void>(`${this.url}/${id}`, input);
  }


  refresh(){
    this.refresh$.next();
  }
  get refreshObs$(){
    return this.refresh$.asObservable();
  }

  count(day: number) {
    let params = new HttpParams();
    if(day > 0){
      params = params.set('day', day);
    }
    return this.httpClient.get<{day: string, total: number}[]>(`${this.url}/count`, {params : params})
  }
}
