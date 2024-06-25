import {Component, Input} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-checkbox',
  standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule
    ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {

  @Input()
  control!: FormControl;

  @Input()
  title!: string;

}
