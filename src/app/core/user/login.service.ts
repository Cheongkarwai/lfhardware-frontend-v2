import {inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private userService: UserService, private httpClient: HttpClient) {
  }

  // async login(emailAddress: string, password: string) {
  //   const result = await signInWithEmailAndPassword(this.auth, emailAddress, password);
  //   if (result.user != null) {
  //     this.user$.next(result.user);
  //     this.isLoggedIn$.next(true);
  //     return true;
  //   }
  //   return false;
  // }


  login(){
    window.location.href = window.location.origin + '/oauth2/authorization/keycloak';
  }
  logout() {
    return this.httpClient.post('/logout', {}, {observe: 'response'});
  }

}
