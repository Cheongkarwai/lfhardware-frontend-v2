import {Component, Inject} from '@angular/core';
import {TuiAccordionModule, TuiInputDateTimeModule, TuiInputModule, TuiInputMonthRangeModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiDialogContext, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {CommonModule, NgIf} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TransactionService} from "../../../../../core/transaction/transaction.service";
import {Observable} from "rxjs";
import {Transaction} from "../../../../../core/transaction/transaction.interface";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-view-transaction-details',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiInputMonthRangeModule,
    TuiTextfieldControllerModule,
    TuiInputDateTimeModule,
    TuiButtonModule,
    TuiAccordionModule,
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './view-transaction-details.component.html',
  styleUrl: './view-transaction-details.component.scss'
})
export class ViewTransactionDetailsComponent {

  id: string;
  transaction$!:Observable<Transaction>;

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<boolean>, private transactionService: TransactionService) {
    this.id = this.context.data as any;
    this.transaction$ = transactionService.findById(this.id);
  }
}
