import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../../user/login.service";
import {from, map, take} from "rxjs";
import {Auth} from "@angular/fire/auth";

export const cartGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return from(auth.authStateReady()).pipe(take(1),map(result=>{
    if(auth.currentUser){
      return true;
    }
    router.navigate(['auth','login'])
    return false;
  }))

};
