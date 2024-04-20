import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-get-quote',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './get-quote.component.html',
  styleUrl: './get-quote.component.scss'
})
export class GetQuoteComponent {

}
