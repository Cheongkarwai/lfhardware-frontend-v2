import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {Pageable, PageRequest} from "../page/pagination.interface";
import {Appointment} from "./appointment.interface";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly url = `${environment.api_url}/appointments`;

  refreshServiceProviderManageAppointment$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private httpClient: HttpClient) {
  }

  findCurrentProviderAppointments(pageRequest: PageRequest) {
    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('size', pageRequest.page_size);
    if (pageRequest.sort) {
      params = params.set('sort', pageRequest.sort);
    }
    return this.httpClient.get<Pageable<Appointment>>(`${this.url}`, {params: params});
  }

  createAppointment(appointmentInput: {
    service_provider_id: string,
    service_id: number,
    estimated_price: number;
  }) {
    return this.httpClient.post(`${this.url}`, appointmentInput, {responseType: 'text'});
  }

  updateAppointmentStatus(input: {
    ids: { customer_id: string, service_provider_id: string, service_id: number, created_at: Date }[],
    status: string
  }) {
    return this.httpClient.put<void>(`${this.url}/status`, input);
  }

  payAppointmentFees(appointment: Appointment) {
    return this.httpClient.post(`${this.url}/${appointment.service.id}/${appointment.service_provider.id}/${appointment.customer.id}/${appointment.created_at}/fees`,
      {estimated_price: appointment.estimated_price}, {responseType: 'text'});
  }

  findById(serviceId: number, serviceProviderId: string, customerId: string, createdAt: Date) {
    return this.httpClient.get<Appointment>(`${this.url}/${serviceId}/${serviceProviderId}/${customerId}/${createdAt}`);
  }

  findAll(pageRequest: PageRequest, status: string[]){
    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('size', pageRequest.page_size);
    if (pageRequest.sort) {
      params = params.set('sort', pageRequest.sort);
    }
    if (pageRequest.search.keyword && pageRequest.search.attributes.length > 0) {
      for (const attribute of pageRequest.search.attributes) {
        params = params.append('search', attribute);
      }
      params = params.set('keyword', pageRequest.search.keyword);
    }
    if(status.length > 0){
      for(let stat of status){
        params = params.append('status', stat);
      }
    }
    return this.httpClient.get<Pageable<Appointment>>(`${this.url}`, {params: params});
  }

  count(status: string, day: number){
    let params = new HttpParams();
    if(status){
      params = params.set('status', status);
    }
    if(day > 0){
      params = params.set('day', day);
    }
    return this.httpClient.get<{day: string, total: number}[]>(`${this.url}/count`, {params: params});
  }

  save(body: { estimated_price: number; service_provider_id: string; service_id: number; status: string }) {
    return this.httpClient.post(`${this.url}`, body, {responseType: 'text'});
  }
}
