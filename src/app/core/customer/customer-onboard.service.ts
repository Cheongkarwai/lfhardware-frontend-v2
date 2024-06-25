import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomerOnboardService {

  private basicInformation$: BehaviorSubject<BasicInformation | null> = new BehaviorSubject<BasicInformation | null>(null);

  constructor(private httpClient: HttpClient) {
  }

  saveBasicInformation(basicInformation: BasicInformation | null) {
    this.basicInformation$.next(basicInformation);
  }

}

export interface BasicInformation {
  phone_number: string,
  address: { line_1: string, line_2: string, city: string, state: string, zipcode: string }
}
