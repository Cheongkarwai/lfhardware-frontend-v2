import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TuiButtonModule} from "@taiga-ui/core";
import {TuiPreviewActionModule} from "@taiga-ui/addon-preview";

@Component({
  selector: 'app-preview-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-button.component.html',
  styleUrl: './preview-button.component.scss'
})
export class PreviewButtonComponent {


  @Input()
  disabled: boolean = false;
}
