import {Component, Inject, Input} from '@angular/core';
import {AlertService} from "../../core/service/alert.service";
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";


export enum Status{
  SUCCESS,ERROR, WARNING
}
@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {


  @Input()
  isShowing: boolean | null = false;
  constructor(private alertService: AlertService,
              private dialogRef: MatDialogRef<AlertDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string, status: Status}) {

  }

  close(){
    this.dialogRef.close();
    //this.alertService.closeAlert();
    //this.alertService.closeAlert();
  }

  get text(){
    return this.data.text;
  }
  get title(){
    return this.data.title;
  }

  get status(){
    return this.data.status;
  }


  protected readonly Status = Status;
}
