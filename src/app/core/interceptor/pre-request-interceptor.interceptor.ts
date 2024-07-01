import {HttpInterceptorFn} from '@angular/common/http';
import {LoginService} from "../user/login.service";
import {inject} from "@angular/core";
import {catchError, of} from "rxjs";


export const preRequestInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const loginService: LoginService = inject(LoginService);


  return next(req)
  //   .pipe(catchError((res)=>{
  //   if(res.status === 401){
  //     loginService.login();
  //     return of(res);
  //   }
  //   return of(res);
  // }));
  // let authReq = req.clone({headers:new HttpHeaders().set('Authorization',`Bearer ${result}`)});
  // return next(authReq);

  // if(auth.currentUser?.getIdToken(true) === undefined){
  //   return next(req);
  // }
  //
  // return from(auth.currentUser?.getIdToken(true) as Promise<string>).pipe(flatMap(result=>{
  //   if(result){
  //     let authReq = req.clone({headers:new HttpHeaders().set('Authorization',`Bearer ${result}`)});
  //     return next(authReq);
  //   }
  //   return next(req);
  // }));
};
