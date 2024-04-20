import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {catchError, flatMap, from, lastValueFrom, map, mergeMap, Observable, of} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {UserService} from "../user/user.service";
import {LoginService} from "../user/login.service";
import {Auth} from "@angular/fire/auth";

export const preRequestInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  if(auth.currentUser?.getIdToken(true) === undefined){
    return next(req);
  }

  return from(auth.currentUser?.getIdToken(true) as Promise<string>).pipe(flatMap(result=>{
    if(result){
      let authReq = req.clone({headers:new HttpHeaders().set('Authorization',`Bearer ${result}`)});
      return next(authReq);
    }
    return next(req);
  }));
};
