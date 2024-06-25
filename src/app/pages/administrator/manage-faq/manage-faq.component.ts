import {Component, OnInit} from '@angular/core';
import {InputTextFormComponent} from "../../service-provider/create-form/input-text-form/input-text-form.component";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {Faq} from "../../../core/faq/faq.interface";
import {FaqService} from "../../../core/faq/faq.service";
import {map, Observable, ReplaySubject, startWith, switchMap, take} from "rxjs";
import {ButtonComponent} from "../../../components/button/button.component";
import {DialogSubscriptionService} from "../../../core/dialog/dialog.service";
import {ConfirmationDialogComponent} from "../../../components/confirmation-dialog/confirmation-dialog.component";
import {ToastService} from "../../../core/dialog/toast.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TuiDialogService} from "@taiga-ui/core";
import {DialogModule} from "@angular/cdk/dialog";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AddFaqComponent} from "./add-faq/add-faq.component";
import {TextInputComponent} from "../../../components/text-input/text-input.component";

@Component({
  selector: 'app-manage-faq',
  standalone: true,
  imports: [
    InputTextFormComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatDialogModule,
    TextInputComponent
  ],
  templateUrl: './manage-faq.component.html',
  styleUrl: './manage-faq.component.scss'
})
export class ManageFaqComponent implements OnInit {

  faqFormArray!: FormArray;
  faqs$!: Observable<Faq[]>;
  refresh$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private fb: FormBuilder, private faqService: FaqService,
              private toastService: ToastService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.faqFormArray = new FormArray<any>([]);
    this.faqs$ = this.refresh$.pipe(startWith(''), switchMap(refresh => this.faqService.findAll()
      .pipe(map(faqs => {
        faqs.forEach(faq => this.addFormGroup(faq));
        return faqs;
      }))
    ))
  }

  getTitleControl(i: number) {
    return this.faqFormArray.at(i).get('title') as FormControl;
  }

  getDescriptionControl(i: number) {
    return this.faqFormArray.at(i).get('description') as FormControl;
  }

  addFormGroup(faq: Faq) {
    this.faqFormArray.push(this.fb.group({
      id: faq.id,
      title: faq.title,
      description: faq.description
    }));
  }

  addFAQ(){
    this.dialog.open(AddFaqComponent)
  }
  removeFAQ(i: number) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete FAQ',
        text: 'Are you sure you want to delete this faq? All of the data will be permanently removed. This action cannot be undone.',
        icon: 'error'
      }
    })
      .afterClosed().subscribe(res => {
      if (res) {
        const faq = this.faqFormArray.at(i).getRawValue();
        this.faqService.deleteById(faq.id)
          .subscribe({
            next: res => {
              this.toastService.open('Successfully deleted', 'success');
              this.refresh$.next();
            },
            error: err => {

            }
          });
      }

    })
    // const ref = this.dialogSubscriptionService.showConfirmationDialog({
    //   title: 'Delete User Account',
    //   text: 'Are you sure you want to delete this account? All of the data will be permanently removed. This action cannot be undone.',
    //   icon: 'error'
    // })
    //   .subscribe(res => {
    //     console.log(res);
    //     if (res) {
    //       // const faq = this.faqFormArray.at(i).getRawValue();
    //       // this.faqService.deleteById(faq.id)
    //       //   .subscribe({
    //       //     next: res => {
    //       //       this.toastService.open('Successfully deleted', 'success');
    //       //     },
    //       //     error: err => {
    //       //
    //       //     }
    //       //   });
    //     }
    //   });
  }
}
