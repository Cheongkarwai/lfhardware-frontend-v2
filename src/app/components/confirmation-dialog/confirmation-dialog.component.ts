import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AlertService} from "../../core/service/alert.service";
import {DialogSubscriptionService} from "../../core/dialog/dialog.service";

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {

  @Output() confirm = new EventEmitter<boolean>();

  constructor(private dialogService: DialogSubscriptionService) {
  }

  close(){
    this.dialogService.closeConfirmationDialog();
  }

  handleConfirm($event: MouseEvent) {
    this.confirm.emit(true);
    this.dialogService.closeConfirmationDialog();
  }

  get title(){
    return this.dialogService.confirmationDialog.title;
  }

  get text(){
    return  this.dialogService.confirmationDialog.text;
  }

  get isVisible(){
    return this.dialogService.isConfirmationDialogVisible;
  }
}
