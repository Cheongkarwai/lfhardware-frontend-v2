import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {Faq} from "./faq.interface";

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private readonly url = `${environment.api_url}/faqs`;

  constructor(private httpClient: HttpClient) {
  }

  findAll() {
    return this.httpClient.get<Faq[]>(`${this.url}`);
  }

  save(faq: Faq) {
    return this.httpClient.post<Faq[]>(`${this.url}`, faq);
  }

  deleteById(id: number) {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  updateById(id: number, faq: Faq) {
    return this.httpClient.put<void>(`${this.url}/${id}`, faq);
  }
}
