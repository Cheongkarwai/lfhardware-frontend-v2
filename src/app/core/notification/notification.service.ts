import {Injectable, NgZone} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {
  BehaviorSubject,
  concatMap,
  from, Observable,
  of,
  Subject, Subscriber,
  switchMap,
  take
} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

export interface Notification {
  message: string;
  created_at: Date;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url = `${environment.api_url}/notifications`;

  private notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);


  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
  }

  findUserNotification() {
    return this.httpClient.get<Notification[]>(`${this.url}`)
  }

  get notifications(){
    return this.notifications$.asObservable();
  }

  // createNotification(){
  //   return this.httpClient.post(this.url, {username:'cheong321@gmail.com'});
  // }
  streamNotification() {
    const eventSource = new EventSource(this.url, {withCredentials: true});
    return new Observable((subscriber: Subscriber<Event>) => {
      eventSource.onopen = message=>{
      }
      eventSource.addEventListener('notification', (message)=>{
        this.ngZone.run(()=> {
          const notifications: Notification[] = this.notifications$.value;
          this.notifications$.next(notifications.concat(JSON.parse(message.data)));
          //subscriber.next(JSON.parse(message.data))
        });
      })
      // eventSource.onmessage = message=>{
      //   console.log(message);
      //   this.ngZone.run(()=> subscriber.next(JSON.parse(message.data)));
      // }
      eventSource.onerror = error => {
        this.ngZone.run(() => subscriber.error(error));
      };
    });

    // eventNames.forEach((event: string) => {
    //   eventSource.addEventListener(event, data => {
    //     this.ngZone.run(() => subscriber.next(data));
    //   });
    // });

    // const eventSource = new EventSource(this.url);
    // eventSource.addEventListener('myEvent', function (e){
    //
    // })
    // // eventSource.onmessage = x => {
    // //   this.ngZone.run(()=>{
    // //     console.log(x)
    // //   });
    // // }
    // eventSource.onerror = x => {
    //   console.log(x)
    //
    // }


    // return fromPromise(fetchEventSource(this.url, {
    //   headers: {},
    //   onmessage(message) {
    //     return of(message);
    //   },
    //   onerror(err) {
    //
    //   },
    //   onclose() {
    //
    //   }
    // }));
  }

  save(notification: Notification) {
    return this.httpClient.post(this.url, notification);
  }

  // return from(this.loginService.getToken())
  //   .pipe(switchMap(token=> {
  //     return defer(()=>
  //       of(fetchEventSource('http://localhost:8081/api/v1/notifications', {
  //         headers: {'Authorization':`Bearer ${token}`},
  //         onmessage(message){
  //           console.log(message);
  //         }
  //       })));
  //     console.log(token);
  //
  //     return of(1);
  //   }))
  //
  //  return of(this.auth.authStateReady()).pipe(concatMap(e=> of(this.auth.currentUser?.getIdToken()))).pipe(
  //    concatMap(token=> {
  //      console.log(token);
  //      return of(fetchEventSource('http://localhost:8081/api/v1/notifications', {
  //        headers: {'Authorization':`Bearer ${token}`},
  //        onmessage(message){
  //          console.log(message);
  //        }
  //      }))
  //    })
  //  );
  // // const token = await this.auth.currentUser?.getIdToken();
  // await fetchEventSource('http://localhost:8081/api/v1/notifications', {
  //   headers: {
  //     'Authorization': 'Bearer '+token
  //   },
  //   onmessage(message){
  //     console.log(message);
  //   }
  // })
  //
  // let source = new EventSource('http://localhost:8081/api/v1/notifications', {
  //
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
