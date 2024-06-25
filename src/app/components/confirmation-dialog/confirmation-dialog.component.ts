import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AlertService} from "../../core/service/alert.service";
import {DialogSubscriptionService} from "../../core/dialog/dialog.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnDestroy {

 // @Output() confirm = new EventEmitter<boolean>();

  constructor( public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string, icon: string}, ) {
  }

  close(){
    this.dialogRef.close();
  }

  ngOnDestroy(){

  }

  get title(){
    return this.data.title;
  }

  get text(){
    return  this.data.text;
  }

  get icon(){
    return this.data.icon;
  }
}
