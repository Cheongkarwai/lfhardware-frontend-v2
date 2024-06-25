import {HttpInterceptorFn} from '@angular/common/http';


export const preRequestInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req);
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
