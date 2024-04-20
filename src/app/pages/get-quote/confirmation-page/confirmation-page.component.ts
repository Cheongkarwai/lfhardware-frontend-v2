import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss'
})
export class ConfirmationPageComponent {
  faTest = faCheck;

}
