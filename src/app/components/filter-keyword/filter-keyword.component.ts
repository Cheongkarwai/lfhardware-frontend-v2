import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TextInputComponent} from "../text-input/text-input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CheckboxComponent} from "../checkbox/checkbox.component";

export interface FilterCategory{
  title: string;
  controlType: string;
  categoryItems: {
    title: string;
    value: string;
    control: FormControl;
  }[];
}
@Component({
  selector: 'app-filter-keyword',
  standalone: true,
  imports: [CommonModule, TextInputComponent, CheckboxComponent, ReactiveFormsModule],
  templateUrl: './filter-keyword.component.html',
  styleUrl: './filter-keyword.component.scss'
})
export class FilterKeywordComponent {

  @Input()
  filterCategories!: FilterCategory[];

  constructor() {
  }
}
