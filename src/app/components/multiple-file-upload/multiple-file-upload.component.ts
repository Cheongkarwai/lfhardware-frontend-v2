import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiFileLike,
  TuiFilesModule,
  TuiInputFilesModule,
  TuiMarkerIconModule
} from "@taiga-ui/kit";
import {TuiErrorModule, TuiSvgModule} from "@taiga-ui/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Subject} from "rxjs";

@Component({
  selector: 'app-multiple-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    TuiFilesModule,
    TuiInputFilesModule,
    TuiMarkerIconModule,
    TuiSvgModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'File is required',
        email: 'Enter a valid email',
        maxlength: ({requiredLength}: { requiredLength: string }) =>
          `Maximum length — ${requiredLength}`,
      },
    }
  ],
  templateUrl: './multiple-file-upload.component.html',
  styleUrl: './multiple-file-upload.component.scss'
})
export class MultipleFileUploadComponent implements OnInit,OnChanges, OnDestroy{

  @Input() control!: FormControl;
  @Input() multiple:boolean = false;

  @Output() removeFiles = new EventEmitter<File>();

  files!:TuiFileLike[];
  file!:TuiFileLike | null;

  destroy$ = new Subject<void>();
  ngOnInit() {
    this.control.valueChanges.pipe().subscribe(res=>{
      console.log(res);
      if(res) {
        if(this.multiple){
          this.files = res;
        }else{
          this.file = res;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['control'].currentValue != changes['control'].previousValue){
      const formControl = changes['control'].currentValue as FormControl;
      if(this.multiple){
        this.files = formControl.getRawValue();
      }else{
        this.file = formControl.getRawValue();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFile(fileNumberTypes:string , i: number) {
    if(fileNumberTypes === 'multiple'){
      this.files.splice(i,1);
    }else if(fileNumberTypes === 'single'){
      this.file = null;
    }
  }
}
