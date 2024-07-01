import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {UserAccount} from "./user-account.interface";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Subject} from "rxjs";
import {Pageable} from "../page/pagination.interface";
import {UserPageRequest} from "./user-page-request.interface";
import {Role} from "./role.interface";
import {UserProfile} from "./user.profile";
import {Customer} from "../customer/customer.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = `${environment.api_url}/users`;
  private users = new BehaviorSubject<UserAccount | null>(null);
  refresh$: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  findAll(pageRequest: UserPageRequest) {

    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', pageRequest.page);
    httpParams = httpParams.set('page_size', pageRequest.page_size);

    if (pageRequest.sort) {
      httpParams = httpParams.set('sort', pageRequest.sort);
    }

    return this.http.get<Pageable<UserAccount>>(`${this.url}`, {params: httpParams});
  }

  findByUid(uid: string) {
    return this.http.get<Customer>(`${this.url}/${uid}`);
  }

  createNewAccount(account: UserAccount, socialLogin: boolean) {
    let params = new HttpParams();
    if (socialLogin) {
      params = params.set('social_login', socialLogin);
    }
    return this.http.post(`${this.url}/register`, account, {params: params});
  }

  deleteUsers(uid: string[]) {
    return this.http.delete(this.url, {body: uid});
  }

  verifyEmail(email: string) {
    return this.http.post(`${this.url}/verify-email`, {email: email});
  }

  recoverAccount(email: string | null) {
    return this.http.post(`${this.url}/account-recovery-email`, {email_address: email});
  }

  deleteUser(uid: string) {
    return this.http.delete(`${this.url}/${uid}`);
  }


  findByUsername(username: string) {
    return this.http.get(`${this.url}/${username}`, {observe: 'response'});
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.http.get(`${this.url}/phone-number/${phoneNumber}`, {observe: 'response'});
  }

  findAllCurrentUserRoles() {
    return this.http.get<Role[]>(`${this.url}/roles/me`);
  }

  refresh() {
    this.refresh$.next();
  }


  findUserAccountByUsername(username: any) {
    return this.http.get<UserAccount>(`${this.url}/${username}/account`);
  }

  count() {
    return this.http.get<number>(`${this.url}/count`);
  }

  countDailyUser(days: number) {

    let params = new HttpParams();
    params = params.set('days', days);

    return this.http.get<{ day: never, total: number }[]>(`${this.url}/daily-user-count`, {params: params});
  }

  changePassword(username: string, changePassword: {
    current_password: string | null,
    password: string | null,
    confirm_password: string | null
  }) {
    return this.http.post(`${this.url}/${username}/change-password`, changePassword);
  }

  updateUser(userProfile: UserProfile) {
    return this.http.put(`${this.url}/${userProfile.username}`, userProfile);
  }

  findLoggedInUsername(){
    return this.http.get(`${this.url}/me/username`, {responseType: 'text'})
  }

}
