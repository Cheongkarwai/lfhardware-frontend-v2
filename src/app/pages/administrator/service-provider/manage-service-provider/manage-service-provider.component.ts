import {Component, Inject, Injector, OnDestroy} from '@angular/core';
import {TableComponent} from "../../../../components/table/table.component";
import {TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TUI_PROMPT, TuiInputModule} from "@taiga-ui/kit";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {RouterLink} from "@angular/router";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, Observable, startWith, Subject, switchMap} from "rxjs";
import {Pageable} from "../../../../core/page/pagination.interface";
import {ServiceProvider} from "../../../../core/service-provider/service-provider.interface";
import {ServiceProviderRequest} from "../../../../core/service-provider/service-provider-request.interface";
import {ProviderService} from "../../../../core/service-provider/service-provider.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {ServiceProviderDetails} from "../../../../core/service-provider/service-provider-details";
import {AlertService} from "../../../../core/service/alert.service";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {ViewServiceProviderComponent} from "./view-service-provider/view-service-provider.component";
import {ButtonComponent} from "../../../../components/button/button.component";

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
export class ManageServiceProviderComponent implements OnDestroy{
  page = 0;
  size = 50;
  columns = [
    {key: 'id', value: "Id"},
    {key: 'name', value: 'Name'},
    {key: 'is_verified', value: 'Verified'},
    {key: 'rating', value: 'Rating'}
  ];
  links = [
    {fragment: 'APPROVED', link: '', title: 'Approved'},
    {fragment: 'PENDING', link: '', title: 'Pending'},
    {fragment: 'REJECTED', link: '', title: 'Rejected'}
  ];
  activeId = 'APPROVED';

  pageableProvider$: Observable<Pageable<ServiceProvider>>;
  pageRequest: ServiceProviderRequest = {
    page: 0,
    search: {
      attributes : [],
      keyword : ''
    },
    page_size: 10,
    sort: '',
    min_price: 0,
    max_price: 0,
    rating: [],
    service_name: '',
    states: [],
    status: this.activeId,
  }
  search = new FormControl('');

  paginationChange$ = new BehaviorSubject(this.pageRequest);

  menuItems = [
    {title: 'View', iconName: 'tuiIconEye'},
    {title: 'Approve', iconName: 'tuiIconCheck'},
    {title:'Reject', iconName: 'tuiIconSlash'},
    {title: 'Delete', iconName: 'tuiIconTrash'},
  ];

  destroy$ = new Subject<void>();

  constructor(private providerService: ProviderService, private alertService: AlertService, private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector) {
    this.pageableProvider$ = combineLatest([this.providerService.refresh.pipe(startWith('')),this.paginationChange$.pipe(startWith(this.pageRequest)), this.search.valueChanges.pipe(startWith(''))])
      .pipe(switchMap(([refresh,pageRequest, search]) => {
        if(search){
          pageRequest.search.keyword = search;
        }
        return this.providerService.findAll(pageRequest);
      }));

    this.providerService.updateStatus(23,{status:'APPROVED'}).subscribe({
      next:res=>console.log(res)
    });
  }

  changePagination(pagination: TuiTablePagination) {
    this.pageRequest.page = pagination.page;
    this.pageRequest.page_size = pagination.size;
    this.paginationChange$.next(this.pageRequest);
  }

  get searchValue() {
    return this.search.getRawValue() as string;
  }

  navChange(activeId: any) {
    this.pageRequest.status = activeId;
    this.activeId = activeId;
    this.paginationChange$.next(this.pageRequest);
  }

  handleContextMenu(event: {action:string, data: ServiceProviderDetails}) {
    switch(event.action){
      case 'View':
        this.dialogs
          .open(
            new PolymorpheusComponent(ViewServiceProviderComponent, this.injector),
            {
              size: 'auto',
              closeable: true,
              dismissible: true,
              data: event.data.id,
            },
          )
          .subscribe();
        break;
      case 'Approve':
        this.dialogs
          .open<boolean>(TUI_PROMPT, {
            label: `Are you sure you want to approve ${event.data.name} to be service provider in your platform?`,
            data: {
              content: 'This action is reversible',
              yes: 'Approve',
              no: 'Cancel',
            },
          })
          .subscribe((response:boolean) => {
            if(response){
              this.providerService.updateStatus(event.data.id,{status:'APPROVED'}).subscribe({
                next:res=>{
                  this.alertService.showSuccess(`You have approved ${event.data.name}`);
                  this.providerService.refresh.next();
                },
                error:err=>this.alertService.showError('Something went wrong')
              });
            }
          });
        break;
      case 'Reject':
        this.dialogs
          .open<boolean>(TUI_PROMPT, {
            label: `Are you sure you want to reject ${event.data.name} to be service provider in your platform?`,
            data: {
              content: 'This action is reversible',
              yes: 'Reject',
              no: 'Cancel',
            },
          })
          .subscribe((response:boolean) => {
            if(response){
              this.providerService.updateStatus(event.data.id,{status:'REJECTED'}).subscribe({
                next:res=>{
                  this.alertService.showSuccess(`You have rejected ${event.data.name}`);
                  this.providerService.refresh.next();
                },
                error:err=>this.alertService.showError('Something went wrong')
              });
            }
          });
        break

      case 'Delete':
        this.dialogs
          .open<boolean>(TUI_PROMPT, {
            label: `Are you sure you want to permanently delete ${event.data.name}?`,
            data: {
              content: 'This action is irreversible',
              yes: 'Reject',
              no: 'Cancel',
            },
          })
          .subscribe((response:boolean) => {
            // if(response){
            //   this.providerService.updateStatus(event.data.id,{status:'REJECTED'}).subscribe({
            //     next:res=>{
            //       this.alertService.showSuccess(`You have rejected ${event.data.name}`);
            //       this.providerService.refresh.next();
            //     },
            //     error:err=>this.alertService.showError('Something went wrong')
            //   });
            // }
          });
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
