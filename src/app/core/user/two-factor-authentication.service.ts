import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthenticationService{

  private url = `${environment.api_url}/2fa`;

  constructor(private httpClient: HttpClient) {
  }

  setupWebauthn(){
    return this.httpClient.put(`${this.url}/webauthn`, {});
  }

  setupOtp(){
    return this.httpClient.put(`${this.url}/otp`, {});
  }

}
