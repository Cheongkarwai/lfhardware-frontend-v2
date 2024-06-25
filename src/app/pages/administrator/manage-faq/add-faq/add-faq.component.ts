import {Component, Inject, OnInit} from '@angular/core';
import {FaqService} from "../../../../core/faq/faq.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastService} from "../../../../core/dialog/toast.service";

@Component({
  selector: 'app-add-faq',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-faq.component.html',
  styleUrl: './add-faq.component.scss'
})
export class AddFaqComponent implements OnInit {

  faqForm!: FormGroup;

  constructor(private faqService: FaqService, public dialogRef: MatDialogRef<AddFaqComponent>,
              private fb: FormBuilder, private toastService: ToastService) {
  }

  ngOnInit() {
    this.faqForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  save() {
    this.faqForm.markAllAsTouched();
    if (this.faqForm.valid) {
      this.faqService.save(this.faqForm.getRawValue())
        .subscribe({
          next: res => {
            this.dialogRef.close();
            this.dialogRef.afterClosed().subscribe(res => {
              this.toastService.open('Saved', 'success');
            })
          }
        })
    }
  }
}
