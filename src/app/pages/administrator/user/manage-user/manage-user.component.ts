import {Component, Inject, Injector} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TableComponent} from "../../../../components/table/table.component";
import {TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonComponent} from "../../../../components/button/button.component";
import {UserService} from "../../../../core/user/user.service";
import {User} from "../../../../core/user/user.interface";
import {Pageable} from "../../../../core/page/pagination.interface";
import {UserPageRequest} from "../../../../core/user/user-page-request.interface";
import {BehaviorSubject, map, Observable, combineLatest, startWith, switchMap} from "rxjs";
import {UserAccount} from "../../../../core/user/user-account.interface";
import {CommonModule} from "@angular/common";
import {UserTable} from "../../../../core/user/user-table.interface";
import {DialogSubscriptionService} from "../../../../core/dialog/dialog.service";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {ViewOrderDetailsComponent} from "../../order/manage-order/view-order-details/view-order-details.component";
import {AddUserComponent} from "../add-user/add-user.component";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {Order} from "../../../../core/order/order.interface";
import {EditUserComponent} from "../edit-user/edit-user.component";
import {ConfirmationDialogComponent} from "../../../../components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    RouterLink,
    TableComponent,
    TuiButtonModule,
    TuiInputModule,
    TuiTablePaginationModule,
    TuiTextfieldControllerModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CommonModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent {

  columns = [
    // {key:'no',value:'No'},
    {key: 'username', value: 'Username', searchKey: ''},
    {key: 'email_address', value: 'Email address', searchKey: ''},
    {key: 'phone_number', value: 'Contact Number', searchKey: ''},
    {key: 'role', value: 'Role', searchKey: ''},
    {key: 'address_line_1', value: 'Address Line 1', searchKey: ''},
    {key: 'address_line_2', value: 'Address Line 2', searchKey: ''},
    {key: 'state', value: 'State', searchKey: ''},
    {key: 'city', value: 'City', searchKey: ''},
    {key: 'zipcode', value: 'Zipcode', searchKey: ''}
    // {key:'active_status',value:'Active Status'},
    // {key:'last_login',value:'Last Login'}
  ];

  menuItems = [
    {title: 'Edit', iconName: 'tuiIconEdit'},
    {title: 'Delete', iconName: 'tuiIconTrash'},
  ];

  userPageable$: Observable<Pageable<UserTable>>;

  pageRequest: UserPageRequest = {
    page: 0,
    page_size: 10,
    search: {
      attributes : [],
      keyword : ''
    },
    sort: '',
  };

  searchFormControl: FormControl<string | null> = new FormControl('');

  pagination$: BehaviorSubject<UserPageRequest> = new BehaviorSubject<UserPageRequest>(this.pageRequest);

  constructor(private userService: UserService, @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector, private dialogSubscriptionService: DialogSubscriptionService) {
    this.userPageable$ = combineLatest([this.searchFormControl.valueChanges.pipe(startWith('')), this.pagination$.pipe(startWith(this.pageRequest)), this.userService.refresh$.pipe(startWith(''))])
      .pipe(switchMap(([search, pageRequest]) => {
        if(search){
          pageRequest.search.keyword = search as string;
        }
        return userService.findAll(pageRequest)
          .pipe(map(users => {
            return {
              current_page: users.current_page,
              size: users.size,
              total_elements: users.total_elements,
              has_next_page: users.has_next_page,
              has_previous_page: users.has_previous_page,
              items: users.items.map(user => {
                return {
                  username: user.username,
                  email_address: user.profile.email_address,
                  phone_number: user.profile.phone_number,
                  role: user.roles.map(role => role.name).join(', '),
                  address_line_1: user.profile.address?.address_line_1,
                  address_line_2: user.profile.address?.address_line_2,
                  state: user.profile.address?.state || '',
                  city: user.profile.address?.city || '',
                  zipcode: user.profile.address?.zipcode || ''
                } as UserTable;
              })
            } as Pageable<UserTable>

          }));
      }));

  }


  changePagination(event: TuiTablePagination) {
    this.pageRequest.page_size = event.size;
    this.pageRequest.page = event.page;
    this.pagination$.next(this.pageRequest);
  }

  get searchValue(){
    return this.searchFormControl.getRawValue() as string;
  }

  openSaveUserDialog() {
    this.dialogSubscriptionService.dialog = this.dialogs
      .open(
        new PolymorpheusComponent(AddUserComponent, this.injector),
        {
          size: 'page',
          closeable: true,
          dismissible: true,
        },
      )
      .subscribe();
  }

  handleContextMenu(event: {action:string, data: User}) {
    switch (event.action) {
      case 'Edit':
        this.dialogSubscriptionService.dialog = this.dialogSubscriptionService.dialog = this.dialogs
          .open(
            new PolymorpheusComponent(EditUserComponent, this.injector),
            {
              size: 'page',
              closeable: true,
              dismissible: true,
              data: event.data.username
            },
          )
          .subscribe();
        break;

      case 'Delete':
        this.dialogSubscriptionService.showConfirmationDialog({title: 'Delete User Account', text: 'Are you sure you want to delete this account? All of the data will be permanently removed. This action cannot be undone.'})
        break;
    }
  }
  handleConfirmationDialogResult(result: boolean){
    if(result){
      console.log(result);
    }
  }
}
