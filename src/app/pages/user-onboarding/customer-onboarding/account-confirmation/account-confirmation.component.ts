import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {initFlowbite} from "flowbite";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-account-confirmation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-confirmation.component.html',
  styleUrl: './account-confirmation.component.scss'
})
export class AccountConfirmationComponent implements OnInit {
  ngOnInit() {
    initFlowbite();
  }

  @Output()
  step: EventEmitter<string> = new EventEmitter<string>();

  nextStep(step: string) {
    this.step.emit(step);
  }
}
