import {Injectable} from "@angular/core";
import {BehaviorSubject, map, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  open$: BehaviorSubject<{ text: string, status: string, show: boolean }> = new BehaviorSubject<{
    text: string,
    status: string,
    show: boolean
  }>({text: '', status: '', show: false});


  constructor() {
  }


  open(text: string, status: string) {
    this.open$.next({
      text: text,
      status: status,
      show: true
    });

    setTimeout(()=>{
      this.close();
    },5000)
  }

  close() {
    this.open$.next({
      text: '',
      status: '',
      show: false
    });
  }

  get openRef() {
    return this.open$.asObservable();
  }
}
