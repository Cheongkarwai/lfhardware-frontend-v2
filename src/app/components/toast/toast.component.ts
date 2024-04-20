import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {ToastService} from "../../core/dialog/toast.service";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {animate, style, transition, trigger} from "@angular/animations";
import {BrowserModule} from "@angular/platform-browser";

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

  @Input()
  text: string = '';
  @Input()
  status: string = '';
  @Input()
  isShowing: boolean = false;


  constructor(private toastService: ToastService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    initFlowbite();
  }

  closeModal() {
    this.toastService.close();
  }
}
