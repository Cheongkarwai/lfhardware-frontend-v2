import {Injectable, NgZone} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {
  from,
  of,
  Subject,
  switchMap,
  take
} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {Auth} from "@angular/fire/auth";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {LoginService} from "../user/login.service";
@Injectable({
  providedIn:'root'
})
export class NotificationService{

  private url = `${environment.api_url}/notifications`;

  private $notification:Subject<MessageEvent> = new Subject<MessageEvent>();


  constructor(private httpClient: HttpClient, private auth: Auth, private loginService: LoginService) {
  }

  createNotification(){
    return this.httpClient.post(this.url, {username:'cheong321@gmail.com'});
  }
  getEvents(){


      return fromPromise(this.loginService.getToken() as PromiseLike<string>)
        .pipe(switchMap(token=>{
          return fromPromise(fetchEventSource(this.url, {
                headers: {'Authorization':`Bearer ${token}`},
                onmessage(message){
                  console.log(message);
                },
                onerror(err){

                },
                onclose(){

                }
              }));
        }));

    // return from(this.loginService.getToken())
    //   .pipe(switchMap(token=> {
        // return defer(()=>
        //   of(fetchEventSource('http://localhost:8081/api/v1/notifications', {
        //     headers: {'Authorization':`Bearer ${token}`},
        //     onmessage(message){
        //       console.log(message);
        //     }
        //   })));
      //   console.log(token);
      //
      //   return of(1);
      // }))

     // return of(this.auth.authStateReady()).pipe(concatMap(e=> of(this.auth.currentUser?.getIdToken()))).pipe(
     //   concatMap(token=> {
     //     console.log(token);
     //     return of(fetchEventSource('http://localhost:8081/api/v1/notifications', {
     //       headers: {'Authorization':`Bearer ${token}`},
     //       onmessage(message){
     //         console.log(message);
     //       }
     //     }))
     //   })
     // );
    // const token = await this.auth.currentUser?.getIdToken();
    // await fetchEventSource('http://localhost:8081/api/v1/notifications', {
    //   headers: {
    //     'Authorization': 'Bearer '+token
    //   },
    //   onmessage(message){
    //     console.log(message);
    //   }
    // })

    //let source = new EventSource('http://localhost:8081/api/v1/notifications', {

    // });
    // source.addEventListener("message",(message)=>{
    //   console.log(message)
    // })
    // //
    // // this.zone.run(()=>{
    //   source.onmessage = (message=>{
    //     console.log(message);
    //     this.$notification.next(message);
    //   })
    // // })
    //
    // source.onerror = (err=>{
    //   console.log(err);
    // })
    // return new Observable(event = > {
    //   return this.source.onmessage = (message=>{
    //     return message;
    //   },false)
    //
    // });
  }

}
