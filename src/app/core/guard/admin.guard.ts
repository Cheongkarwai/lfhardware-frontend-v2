import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../user/user.service";
import {inject} from "@angular/core";
import {map} from "rxjs";

export const adminGuard: CanActivateFn = (route, state) => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);
  return userService.findAllCurrentUserRoles()
    .pipe(map(roles=> {
      if(roles.some(role=> role.name === 'administrator')){
        return true;
      }
      router.navigateByUrl('/access-denied');
      return false;
    }));
};
