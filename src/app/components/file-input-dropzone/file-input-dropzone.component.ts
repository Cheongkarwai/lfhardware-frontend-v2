import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-file-input-dropzone',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './file-input-dropzone.component.html',
  styleUrl: './file-input-dropzone.component.scss'
})
export class FileInputDropzoneComponent {

  @Input()
  control!: FormControl;

  @Input()
  multiple: boolean = false;

  @Input()
  max: number = 0;

  onInputChange(e: any) {
    if (this.multiple) {
      this.control.setValue(Array.from(e.target.files).slice(0, this.max));
    } else {
      this.control.setValue(e.target.files[0]);
    }
  }

  remove(i: number) {
    if (this.multiple) {
      const files: File[] = this.control.getRawValue() as File[];
      files.splice(i, 1);
      this.control.setValue(files);
    }
  }
}
