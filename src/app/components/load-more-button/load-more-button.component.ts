import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-load-more-button',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './load-more-button.component.html',
  styleUrl: './load-more-button.component.scss'
})
export class LoadMoreButtonComponent {

}
