import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-range-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './range-input.component.html',
  styleUrl: './range-input.component.scss'
})
export class RangeInputComponent {

  @Input()
  control! : FormControl;
}
