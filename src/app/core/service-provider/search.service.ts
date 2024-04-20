import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SearchService{

  open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  show(){
    this.open$.next(true)
  }

  close(){
    this.open$.next(false);
  }

  get openObs(){
    return this.open$.asObservable();
  }
}
