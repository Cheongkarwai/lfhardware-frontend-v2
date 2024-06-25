import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-download-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-button.component.html',
  styleUrl: './download-button.component.scss'
})
export class DownloadButtonComponent {
  @Input()
  text: string = '';

  @Input()
  disabled: boolean = false;
}
