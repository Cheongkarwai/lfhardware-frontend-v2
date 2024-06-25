import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {

  @Input()
  control!: FormControl;
}
