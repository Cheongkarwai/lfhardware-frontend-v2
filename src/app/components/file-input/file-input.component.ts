import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent {

  @Input()
  control!: FormControl;

  @Input()
  label!: string;

  onInputChange(e: any) {
    this.control.setValue(e.target.files[0]);
  }
}
