import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-worker',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './worker.component.html',
  styleUrl: './worker.component.scss'
})
export class WorkerComponent {

}
