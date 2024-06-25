import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {UserAccount} from "./user-account.interface";
import {HttpClient} from "@angular/common/http";
import {ResetPassword} from "./reset-password.interface";
import {OtpInput, OtpQrcode} from "./otp-qrcode.interface";
import {UserCredential} from "./user-credential.interface";
import {Role} from "./role.interface";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url = `${environment.api_url}/accounts`;


  constructor(private http: HttpClient) {
  }

  findCurrentlyLoggedInUser() {
    return this.http.get<UserAccount>(`${this.url}/me`);
  }

  createStripeAccount() {
    return this.http.post(`${this.url}/stripe`, {}, {responseType: 'text'});
  }

  createCheckoutSession() {
    return this.http.post(`${environment.api_url}/checkout/sessions`, {});
  }

  transferPayment() {
    return this.http.post(`${environment.api_url}/transfers`, {});
  }

  test() {
    return this.http.get(`${environment.api_url}/accounts/test`, {observe: 'response'});
  }

  resetPassword(resetPasswordInput: ResetPassword) {
    return this.http.put(`${this.url}/reset-password`, resetPasswordInput);
  }

  generateOTPQrCode() {
    return this.http.get<OtpQrcode>(`${this.url}/otp/qr-code`);
  }

  setupOTP(otpInput: OtpInput) {
    return this.http.post<void>(`${this.url}/otp`, otpInput);
  }

  findAllCredentials() {
    return this.http.get<UserCredential[]>(`${this.url}/credentials`)
  }

  findCurrentUserRoles() {
    return this.http.get<Role>(`${this.url}/me/roles`);
  }
}
