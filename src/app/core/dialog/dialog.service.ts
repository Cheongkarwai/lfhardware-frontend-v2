import {Injectable} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogSubscriptionService{

  confirmationDialog:{title:string, text:string, icon:string} = {
    text: '',
    title:'',
    icon: '',
  };

  isConfirmationDialogVisible:boolean = false;

  dialog$!:Subscription;

  showQuickView = false;

  result$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set dialog(subscription:Subscription){
    this.dialog$ = subscription;
  }
  get dialog(){
    return this.dialog$;
  }

  set showQuickViewDialog(value:boolean){
    this.showQuickView = value;
  }

  get showQuickViewValue(){
    return this.showQuickView;
  }


  showConfirmationDialog(data: {title:string, text:string, icon: string}){
    this.confirmationDialog = data;
    this.isConfirmationDialogVisible = true;
    return this.result$.asObservable();
  }

  cancel(){
    this.result$.next(false);
   // this.result$.complete();
    this.isConfirmationDialogVisible = false;
  }

  confirm() {
    this.result$.next(true);
    this.isConfirmationDialogVisible = false;
  }

}
