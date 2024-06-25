import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {TableComponent} from "../../../../components/table/table.component";
import {TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {RouterLink} from "@angular/router";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, Observable, startWith, Subject, switchMap} from "rxjs";
import {Pageable, PageRequest} from "../../../../core/page/pagination.interface";
import {ServiceProvider} from "../../../../core/service-provider/service-provider.interface";
import {ServiceProviderRequest} from "../../../../core/service-provider/service-provider-request.interface";
import {ProviderService} from "../../../../core/service-provider/service-provider.service";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {AlertService} from "../../../../core/service/alert.service";
import {ViewServiceProviderComponent} from "./view-service-provider/view-service-provider.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {MatDialog} from "@angular/material/dialog";
import {Filter} from "../../../../components/table-header/table-header.component";
import {EditServiceProviderComponent} from "./edit-service-provider/edit-service-provider.component";
import {AddServiceProviderComponent} from "./add-service-provider/add-service-provider.component";

@Component({
  selector: 'app-manage-service-provider',
  standalone: true,
  imports: [
    TableComponent,
    TuiButtonModule,
    TuiInputModule,
    TuiTablePaginationModule,
    TuiTextfieldControllerModule,
    RouterLink,
    NgbNavModule,
    CommonModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './manage-service-provider.component.html',
  styleUrl: './manage-service-provider.component.scss'
})
export class ManageServiceProviderComponent implements OnInit, OnDestroy{
  page = 0;
  size = 50;
  columns = [
    {key: 'id', value: "Id"},
    {key: 'name', value: 'Name'},
    {key: 'is_verified', value: 'Verified'},
    {key: 'status', value: 'Status'},
    {key: 'rating', value: 'Rating'}
  ];

  //Filters
  filters: Filter[] = [{
    title: 'Status',
    items: [
      {
        title: 'Approved',
        value: 'APPROVED'
      },
      {
        title: 'Rejected',
        value: 'REJECTED'
      },
      {
        title: 'Pending',
        value: 'PENDING'
      },
    ],
    type: 'checkbox',
    formArray: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false),
      new FormControl(false), new FormControl(false), new FormControl(false), new FormControl(false), new FormControl(false)])
  }];
  pageableProvider$!: Observable<Pageable<ServiceProvider>>;
  pageRequest: PageRequest = {
    page: 0,
    search: {
      attributes : ['id', 'name', 'isVerified', 'status', 'rating'],
      keyword : ''
    },
    page_size: 10,
    sort: '',
    // min_price: 0,
    // max_price: 0,
    // rating: [],
    // service_name: '',
    // states: [],
    //status: '',
  }
  searchControl: FormControl<string | null> = new FormControl<string | null>('');

  pagination$ = new BehaviorSubject(this.pageRequest);


  destroy$ = new Subject<void>();

  constructor(private providerService: ProviderService,
              private alertService: AlertService,
              @Inject(Injector) private readonly injector: Injector,
              private matDialog: MatDialog,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    this.pageableProvider$ = combineLatest([
      this.providerService.refresh.pipe(startWith('')),
      this.pagination$.pipe(startWith(this.pageRequest)),
      this.searchControl.valueChanges.pipe(startWith('')),
      this.filters[0].formArray.valueChanges.pipe(startWith([])),
    ])
      .pipe(switchMap(([refresh,pageRequest, search,  statusArray]) => {
        pageRequest.search.keyword = '';
        if(search){
          pageRequest.search.keyword = search;
        }
        let status: string[] = [];
        for(let i = 0;i < statusArray.length; i ++){
          if(statusArray[i]){
            status.push(this.filters[0].items[i].value);
          }
        }
        return this.providerService.findAll(pageRequest, status, [], null, []);
      }));
  }

  changePagination(pagination: TuiTablePagination) {
    this.pageRequest.page = pagination.page;
    this.pageRequest.page_size = pagination.size;
    this.pagination$.next(this.pageRequest);
  }

  get searchValue() {
    return this.searchControl.getRawValue() as string;
  }


  // handleContextMenu(event: {action:string, data: ServiceProviderDetails}) {
  //   switch(event.action){
  //     case 'View':
  //       this.dialogs
  //         .open(
  //           new PolymorpheusComponent(ViewServiceProviderComponent, this.injector),
  //           {
  //             size: 'auto',
  //             closeable: true,
  //             dismissible: true,
  //             data: event.data.id,
  //           },
  //         )
  //         .subscribe();
  //       break;
  //     case 'Approve':
  //       this.dialogs
  //         .open<boolean>(TUI_PROMPT, {
  //           label: `Are you sure you want to approve ${event.data.name} to be service provider in your platform?`,
  //           data: {
  //             content: 'This action is reversible',
  //             yes: 'Approve',
  //             no: 'Cancel',
  //           },
  //         })
  //         .subscribe((response:boolean) => {
  //           if(response){
  //             this.providerService.updateStatus(event.data.id,{status:'APPROVED'}).subscribe({
  //               next:res=>{
  //                 this.alertService.showSuccess(`You have approved ${event.data.name}`);
  //                 this.providerService.refresh.next();
  //               },
  //               error:err=>this.alertService.showError('Something went wrong')
  //             });
  //           }
  //         });
  //       break;
  //     case 'Reject':
  //       this.dialogs
  //         .open<boolean>(TUI_PROMPT, {
  //           label: `Are you sure you want to reject ${event.data.name} to be service provider in your platform?`,
  //           data: {
  //             content: 'This action is reversible',
  //             yes: 'Reject',
  //             no: 'Cancel',
  //           },
  //         })
  //         .subscribe((response:boolean) => {
  //           if(response){
  //             this.providerService.updateStatus(event.data.id,{status:'REJECTED'}).subscribe({
  //               next:res=>{
  //                 this.alertService.showSuccess(`You have rejected ${event.data.name}`);
  //                 this.providerService.refresh.next();
  //               },
  //               error:err=>this.alertService.showError('Something went wrong')
  //             });
  //           }
  //         });
  //       break
  //
  //     case 'Delete':
  //       this.dialogs
  //         .open<boolean>(TUI_PROMPT, {
  //           label: `Are you sure you want to permanently delete ${event.data.name}?`,
  //           data: {
  //             content: 'This action is irreversible',
  //             yes: 'Reject',
  //             no: 'Cancel',
  //           },
  //         })
  //         .subscribe((response:boolean) => {
  //           // if(response){
  //           //   this.providerService.updateStatus(event.data.id,{status:'REJECTED'}).subscribe({
  //           //     next:res=>{
  //           //       this.alertService.showSuccess(`You have rejected ${event.data.name}`);
  //           //       this.providerService.refresh.next();
  //           //     },
  //           //     error:err=>this.alertService.showError('Something went wrong')
  //           //   });
  //           // }
  //         });
  //       break;
  //   }
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewServiceProviderDetails(serviceProvider: ServiceProvider) {
    this.matDialog.open(ViewServiceProviderComponent, {
      data:{
        serviceProviderId: serviceProvider.id
      },
      height: '500px',
      width: '500px',
    });
  }


  editServiceProviderDetails(serviceProvider: ServiceProvider) {
    this.matDialog.open(EditServiceProviderComponent,{
      data:{
        serviceProviderId: serviceProvider.id
      },
      height: '600px',
      width: '500px',
      disableClose: true
    })
  }



  handleAction(index: number) {
    if(index === 0){
      this.matDialog.open(AddServiceProviderComponent,{
        height: '500px',
        width: '500px',
        disableClose: true
      });
    }
  }
}
