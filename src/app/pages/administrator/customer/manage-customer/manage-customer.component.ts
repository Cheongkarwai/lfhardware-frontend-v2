import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {RouterLink} from "@angular/router";
import {TableComponent} from "../../../../components/table/table.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {BehaviorSubject, map, Observable, startWith, switchMap, combineLatest} from "rxjs";
import {Pageable, PageRequest} from "../../../../core/page/pagination.interface";
import {Customer} from "../../../../core/customer/customer.interface";
import {CustomerService} from "../../../../core/customer/customer.service";
import {MatDialog} from "@angular/material/dialog";
import {ViewCustomerComponent} from "./view-customer/view-customer.component";
import {EditCustomerComponent} from "./edit-customer/edit-customer.component";

export interface CustomerTable {
  id: string;
  name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zipcode: string;
}

@Component({
  selector: 'app-manage-customer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule,
    LoadingSpinnerComponent,
    RouterLink,
    TableComponent,
    TuiTablePaginationModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-customer.component.html',
  styleUrl: './manage-customer.component.scss'
})
export class ManageCustomerComponent implements OnInit {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Customer',
      routerLink: '/customer'
    },
    {
      caption: 'Manage Customer',
      routerLink: '/manage-customer'
    },
  ];

  search: FormControl<string | null> = new FormControl<string | null>('');
  customerPageable$!: Observable<Pageable<CustomerTable>>;
  pageRequest: PageRequest = {
    page: 0,
    search: {
      attributes: [
        'name', 'address.addressLine1',
        'address.addressLine2', 'address.city',
        'address.state', 'address.zipcode'
      ],
      keyword: ''
    },
    page_size: 10,
    sort: '',
  };
  pagination$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.pageRequest);
  columns: { key: string, value: string }[] = [
    {key: 'id', value: "Id"},
    {key: 'name', value: 'Name'},
    {key: 'address_line_1', value: 'Address Line 1'},
    {key: 'address_line_2', value: 'Address Line 2'},
    {key: 'city', value: 'City'},
    {key: 'state', value: 'State'},
    {key: 'zipcode', value: 'Zipcode'},
  ];



  constructor(private customerService: CustomerService,
              private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.customerPageable$ = combineLatest([
      this.search.valueChanges.pipe(startWith('')),
      this.pagination$.pipe(startWith(this.pageRequest))
    ])
      .pipe(switchMap(([search, pageRequest]) => {

        pageRequest.search.keyword = '';

        if (search) {
          pageRequest.search.keyword = search;
        }
        return this.customerService.findAll(pageRequest)
          .pipe(map(customerPageable => {
            return {
              items: customerPageable.items.map(customer => {
                return {
                  id: customer.id,
                  name: customer.first_name + ' ' + customer.last_name,
                  address_line_1: customer?.address?.line_1,
                  address_line_2: customer?.address?.line_2,
                  city: customer?.address?.city,
                  state: customer?.address?.state,
                  zipcode: customer?.address?.zipcode
                }
              }),
              has_previous_page: customerPageable.has_previous_page,
              has_next_page: customerPageable.has_next_page,
              total_elements: customerPageable.total_elements,
              current_page: customerPageable.current_page,
              size: customerPageable.size
            } as Pageable<CustomerTable>

          }));
      }));

  }

  changePagination(event: TuiTablePagination) {
    this.pageRequest.page = event.page;
    this.pageRequest.page_size = event.size;
    this.pagination$.next(this.pageRequest);
  }

  get searchValue() {
    return this.search.getRawValue() as string;
  }

  viewCustomerDetails(customer: CustomerTable) {
    this.matDialog.open(ViewCustomerComponent, {
      data: {
        customerId: customer.id
      },
    });
  }

  editCustomerDetails(customer: CustomerTable) {
    this.matDialog.open(EditCustomerComponent,{
      data: {
        customerId: customer.id
      },
      disableClose: true
    })
  }
}
