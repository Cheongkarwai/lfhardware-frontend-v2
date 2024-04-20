import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {PageRequest} from "../page/pagination.interface";
import {ReviewInput} from "./review-input.interface";


@Injectable({
  providedIn:'root'
})
export class ReviewService{

  private readonly url = `${environment.api_url}/reviews`;
  constructor(private httpClient: HttpClient) {
  }

  save(review: ReviewInput){
    return this.httpClient.post<void>(`${this.url}`, review);
  }

}
