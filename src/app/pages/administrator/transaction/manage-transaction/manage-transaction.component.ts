import {Component, Inject, Injector, OnInit} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {NgbNav, NgbNavLink, NgbNavLinkBase} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {TableComponent} from "../../../../components/table/table.component";
import {TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {PaymentService} from "../../../../core/payment/payment.service";
import {Pageable, PageRequest} from "../../../../core/page/pagination.interface";
import {BehaviorSubject, combineLatest, flatMap, Observable, startWith, Subject, switchMap} from "rxjs";
import {Payment} from "../../../../core/payment/payment.interface";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {AddProductComponent} from "../../product/manage-product/add-product/add-product.component";
import {ViewTransactionDetailsComponent} from "./view-transaction-details/view-transaction-details.component";
import {TransactionService} from "../../../../core/transaction/transaction.service";
import {Transaction} from "../../../../core/transaction/transaction.interface";
import {ButtonComponent} from "../../../../components/button/button.component";

@Component({
  selector: 'app-manage-transaction',
  standalone: true,
    imports: [
        NgForOf,
        NgbNav,
        NgbNavLink,
        NgbNavLinkBase,
        RouterLink,
        TableComponent,
        TuiButtonModule,
        TuiInputModule,
        TuiTablePaginationModule,
        TuiTextfieldControllerModule,
        CommonModule,
        LoadingSpinnerComponent,
        ReactiveFormsModule,
        ButtonComponent
    ],
  templateUrl: './manage-transaction.component.html',
  styleUrl: './manage-transaction.component.scss'
})
export class ManageTransactionComponent implements OnInit {

  page = 0;
  size = 50;
  columns = [
    {key: 'id', value: "Transaction ID"},
    {key: 'charge_amount', value: 'Charge Amount'},
    {key: 'created_at', value: 'Created At'},
    {key: 'currency', value: 'Currency'},
    {key: 'paymentMethod', value: 'Payment Method'},
    {key: 'status', value: 'Status'},
    {key: 'order_id', value: 'OrderId'},
    {key: 'action', value: 'Action'},
  ];

  $pageablePayment!: Observable<Pageable<Transaction>>;

  pageRequest: PageRequest = {
    page: 0,
    page_size: 10,
    sort: '',
    search: {
      attributes : [],
      keyword : ''
    }
  }

  search = new FormControl('');
  paginationChange$ = new BehaviorSubject(this.pageRequest);

  constructor(private transactionService: TransactionService, @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector) {
  }

  ngOnInit() {
    this.$pageablePayment = combineLatest([this.paginationChange$.pipe(startWith(this.paginationChange$.value)), this.search.valueChanges.pipe(startWith(''))])
      .pipe(switchMap(([pageRequest, search]) => {
        pageRequest.search.keyword = search || '';
        return this.transactionService.findAll(pageRequest);
      }));
  }

  viewTransactionDetails(transaction: Transaction) {
    this.dialogs
      .open(
        new PolymorpheusComponent(ViewTransactionDetailsComponent, this.injector),
        {
          size: 'auto',
          closeable: true,
          dismissible: true,
          data: transaction.id,
        },
      )
      .subscribe();
  }

  changePagination(pagination: TuiTablePagination) {
    this.pageRequest.page = pagination.page;
    this.pageRequest.page_size = pagination.size;
    this.paginationChange$.next(this.pageRequest);
  }

  get searchValue(){
    return this.search.getRawValue() as string;
  }
}
