import {Component, Input} from '@angular/core';
import {AlertService} from "../../core/service/alert.service";
import {CommonModule} from "@angular/common";


export enum Status{
  SUCCESS,ERROR, WARNING
}
@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {


  @Input()
  isShowing: boolean | null = false;
  constructor(private alertService: AlertService) {

  }

  close(){
    //this.alertService.closeAlert();
    this.alertService.closeAlert();
  }

  get text(){
    return this.alertService.text;
  }
  get title(){
    return this.alertService.title;
  }

  get status(){
    return this.alertService.statusVal;
  }


  protected readonly Status = Status;
}
