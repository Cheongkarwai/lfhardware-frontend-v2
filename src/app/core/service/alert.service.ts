import {Inject, Injectable} from "@angular/core";
import {TuiAlertService} from "@taiga-ui/core";
import {Status} from "../../components/alert-dialog/alert-dialog.component";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn:'root'
})
export class AlertService{

  text:string = '';
  title:string = '';
  status: Status = Status.SUCCESS;

  show$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(TuiAlertService)
              private readonly alerts: TuiAlertService,) {
  }

  showInfo(message:string){
   this.alerts.open(message,{status:'info'})
      .subscribe();
  }

  showError(message:string){
    this.alerts.open(message,{status:'error'})
      .subscribe();
  }

  showSuccess(message:string){
    this.alerts.open(message,{status:'success'}).subscribe();
  }

  // get showAlertVal(){
  //   return this.showAlert;
  // }
  //
  // set showAlertVal(showAlert){
  //   this.showAlert = showAlert;
  // }

  get statusVal(){
    return this.status;
  }

  showAlert(title:string, text:string, status:Status){
    this.status = status;
    this.title = title;
    this.text = text;
    this.show$.next(true);
  }

  closeAlert(){
    this.show$.next(false);
    //wthis.show = false;
  }


}
