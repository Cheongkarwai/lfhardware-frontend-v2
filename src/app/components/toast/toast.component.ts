import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {ToastService} from "../../core/dialog/toast.service";
import {CommonModule} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({  opacity: 0,  transform: 'translateX(100%)' }),
            animate('0.3s ease-out',
              style({ transform: 'translateX(0%)' ,opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 ,  transform: 'translateX(0%)'}),
            animate('0.3s ease-in',
              style({ transform: 'translateX(100%)',opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class ToastComponent implements AfterViewInit, OnInit {



  constructor(public dialogRef: MatDialogRef<ToastComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {text:string, status: string}) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    initFlowbite();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
