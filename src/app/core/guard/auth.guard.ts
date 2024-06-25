import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const AuthenticationGuard: CanActivateChildFn = async (route, state) => {

  // const auth = inject(Auth);
  // const router = inject(Router);
  // const result = await auth.authStateReady();
  //
  // if(auth.currentUser != null){
  //   router.navigateByUrl('');
  //   return false;
  // }
  return true;
};
