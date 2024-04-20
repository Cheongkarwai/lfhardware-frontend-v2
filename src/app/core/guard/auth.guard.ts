import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Auth} from "@angular/fire/auth";

export const AuthenticationGuard: CanActivateChildFn = async (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);
  const result = await auth.authStateReady();

  if(auth.currentUser != null){
    console.log(auth.currentUser);
    router.navigateByUrl('');
    return false;
  }
  return true;
};
