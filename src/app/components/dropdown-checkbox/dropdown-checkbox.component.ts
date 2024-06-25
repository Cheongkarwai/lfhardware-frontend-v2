import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {initFlowbite} from "flowbite";
import {FormArray, FormControl, ReactiveFormsModule} from "@angular/forms";
import {DropdownItem} from "../dropdown/dropdown.component";

@Component({
  selector: 'app-dropdown-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-checkbox.component.html',
  styleUrl: './dropdown-checkbox.component.scss'
})
export class DropdownCheckboxComponent implements OnInit{

  @Input()
  id!: string;

  @Input()
  label!:string;

  @Input()
  dataList!: DropdownItem[];

  open: boolean = false;

  @Input()
  formArray!: FormArray;

  ngOnInit() {
    initFlowbite();
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  getSelectedFormControl(i: number){
    return this.formArray.at(i).get('selected') as FormControl;
  }

  protected readonly FormControl = FormControl;
}
