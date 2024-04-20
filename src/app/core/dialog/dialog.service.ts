import {Injectable} from "@angular/core";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogSubscriptionService{

  confirmationDialog:{title:string, text:string} = {
    text: '',
    title:'',
  };

  isConfirmationDialogVisible:boolean = false;

  dialog$!:Subscription;

  showQuickView = false;

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

  showConfirmationDialog(data: {title:string, text:string}){
    this.confirmationDialog = data;
    this.isConfirmationDialogVisible = true;
  }

  closeConfirmationDialog(){
    this.isConfirmationDialogVisible = false;
  }

}
