import {Component, Input} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { faClock} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent {

  faClock = faClock;

  @Input() title:string = '';
  @Input() description:string = '';
}
