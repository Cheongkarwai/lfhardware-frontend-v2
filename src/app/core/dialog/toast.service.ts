import {Injectable} from "@angular/core";
import {BehaviorSubject, map, ReplaySubject} from "rxjs";
import {ToastComponent} from "../../components/toast/toast.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private dialogRef!: MatDialogRef<ToastComponent> ;

  constructor(private dialog: MatDialog) {
  }


  open(text: string, status: string) {
    const dialogRef  = this.dialog.open(ToastComponent , {
      hasBackdrop: false,
      data: {
        text: text,
        status: status
      }
    });

    dialogRef.afterOpened().subscribe(res=>{
      setTimeout(()=>{
        dialogRef.close();
      },2000)
    });

  }

  close() {
   this.dialogRef.close();
  }

}
