import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-setup-account-verification',
  standalone: true,
  imports: [],
  templateUrl: './setup-account-verification.component.html',
  styleUrl: './setup-account-verification.component.scss'
})
export class SetupAccountVerificationComponent implements OnInit{

  ngOnInit() {
    initFlowbite();
  }

  @Output()
  step: EventEmitter<string> = new EventEmitter<string>();

  changeStep(step: string) {
    this.step.emit(step);
  }
}
