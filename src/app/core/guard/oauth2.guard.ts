import {CanActivateFn} from '@angular/router';
import {UserService} from "../user/user.service";
import {inject} from "@angular/core";
import {catchError, map, of} from "rxjs";
import {AccountService} from "../user/account.service";
import {LoginService} from "../user/login.service";

export const oauth2Guard: CanActivateFn = (route, state) => {
  const accountService: AccountService = inject(AccountService);
  const loginService: LoginService = inject(LoginService);
  return accountService.findCurrentlyLoggedInUser()
    .pipe(map(user => {
      if(user !== null){
        return true;
      }
     loginService.login();
      return false;
      }),
      catchError(err => {
        loginService.login();
        return of(false);
      }));
};
