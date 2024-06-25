import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AccountService} from "../user/account.service";
import {map} from "rxjs";

export const firstTimeLoginGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const router = inject(Router);
  return accountService.findCurrentlyLoggedInUser()
    .pipe(map(account => {
      if (!account.first_time_login) {
        return true;
      }
      router.navigateByUrl('/user-onboarding');
      return false;
    }))
};
