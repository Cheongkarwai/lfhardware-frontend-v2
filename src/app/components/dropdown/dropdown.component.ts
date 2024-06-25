import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";


export interface DropdownItem{
  title: string;
  value: any;
}
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @Input()
  items!: DropdownItem[];

  @Input()
  control!: FormControl;

  @Input()
  placeholder!: string;

  @Input()
  title!: string;

}
