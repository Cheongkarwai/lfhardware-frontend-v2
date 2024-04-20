import {Injectable} from "@angular/core";
import {Pageable, PageRequest} from "../page/pagination.interface";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Payment} from "../payment/payment.interface";
import {environment} from "../../../environments/environment.development";
import {Transaction} from "./transaction.interface";

@Injectable({
  providedIn:'root'
})
export class TransactionService{

  private url = `${environment.api_url}/transactions`;
  constructor(private httpClient: HttpClient) {
  }
  findAll(pageRequest: PageRequest) {

    let params = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('size', pageRequest.page_size);
    if(pageRequest.sort){
      params = params.set('sort', pageRequest.sort);
    }
    if(pageRequest.search){
      params = params.set('keyword', pageRequest.search.keyword);
    }

    return this.httpClient.get<Pageable<Transaction>>(`${this.url}`,{params:params});
  }

  findById(id: string) {
    return this.httpClient.get<Transaction>(this.url + "/" + id );
  }

  count(){
    return this.httpClient.get<number>(`${this.url}/count`);
  }
}
