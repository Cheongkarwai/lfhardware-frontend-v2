import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-zipcode-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zipcode-input.component.html',
  styleUrl: './zipcode-input.component.scss'
})
export class ZipcodeInputComponent {

  @Input()
  control!:FormControl;
}
