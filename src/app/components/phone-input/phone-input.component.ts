import {AfterViewInit, Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss'
})
export class PhoneInputComponent implements AfterViewInit{

  @Input()
  control !: FormControl<string>;

  prefix = "+60";


  isShowingDropdownDialCode: boolean = false;

  toggleDialCodeDropdown() {
    this.isShowingDropdownDialCode = !this.isShowingDropdownDialCode;
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  selectPrefix(prefix: string) {
    this.prefix = prefix;
  }
}
