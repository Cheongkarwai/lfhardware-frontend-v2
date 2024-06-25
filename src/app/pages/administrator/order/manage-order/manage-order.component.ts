import {Component, Inject, Injector} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {NgbNav, NgbNavItem, NgbNavLink, NgbNavLinkBase} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink, RouterModule} from "@angular/router";
import {TableComponent} from "../../../../components/table/table.component";
import {TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {OrderService} from "../../../../core/order/order.service";
import {Pageable} from "../../../../core/page/pagination.interface";
import {Order} from "../../../../core/order/order.interface";
import {BehaviorSubject, combineLatest, map, Observable, startWith, switchMap} from "rxjs";
import {LoadingSpinnerComponent} from "../../../../components/loading-spinner/loading-spinner.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {OrderPageRequest} from "../../../../core/order/order-page-request.interface";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {ViewOrderDetailsComponent} from "./view-order-details/view-order-details.component";
import {UpdateDeliveryStatusComponent} from "./update-delivery-status/update-delivery-status.component";
import {DialogSubscriptionService} from "../../../../core/dialog/dialog.service";
import {ButtonComponent} from "../../../../components/button/button.component";
import {AlertService} from "../../../../core/service/alert.service";
import {Status} from "../../../../components/alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-manage-order',
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
    RouterModule,
    NgbNavItem,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent {
  page = 0;
  size = 50;
  columns = [
    {key: 'id', value: "Id"},
    {key: 'payment_status', value: 'Payment Status'},
    {key: 'shipping_fees', value: 'Shipping Fees (RM)'},
    {key: 'total', value: 'Total (RM)'},
    {key: 'subtotal', value: 'Subtotal (RM)'},
  ];

  menuItems = [
    {title: 'View Order Details', iconName: 'tuiIconEye'},
    {title:'Update Delivery Status', iconName: 'tuiIconRefreshCw'},
    {title: 'Delete Order', iconName: 'tuiIconTrash'},
    {title: 'Download Receipt', iconName: 'tuiIconDownload'}
  ];

  links = [
    {fragment: 'DELIVERED', link: '', title: 'Delivered'},
    {fragment: 'PENDING', link: '', title: 'Pending'},
    {fragment: 'CANCELLED', link: '', title: 'Cancelled'},
    {fragment: 'OUT_FOR_DELIVERY', link: '', title: 'Out for delivery'}
  ];

  activeId = 'DELIVERED';
  pageableOrder$: Observable<Pageable<Order>>;

  pageRequest: OrderPageRequest = {
    page: 0,
    page_size: 10,
    search: {
      attributes : [],
      keyword : ''
    },
    sort: '',
    delivery_status: this.activeId.toUpperCase()
  }
  paginationChange$ = new BehaviorSubject(this.pageRequest);
  search = new FormControl('');

  constructor(private orderService: OrderService, @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector, private dialogSubscriptionService: DialogSubscriptionService,
              private alertService: AlertService) {

    this.pageableOrder$ = combineLatest([this.orderService.refresh.pipe(startWith('')),this.paginationChange$.pipe(startWith(this.pageRequest)), this.search.valueChanges.pipe(startWith(''))])
      .pipe(switchMap(([refresh,pageRequest, search]) => {
        if (search) {
          pageRequest.search.keyword = search;
        }
        return this.orderService.findAll(pageRequest);
      }));
  }

  changePagination(page: TuiTablePagination) {
    this.pageRequest.page = page.page;
    this.pageRequest.page_size = page.size;
    this.paginationChange$.next(this.pageRequest);
  }

  navChange(activeId: any) {
    this.pageRequest.delivery_status = activeId;
    this.activeId = activeId;
    this.paginationChange$.next(this.pageRequest);

    switch(activeId){
      case 'PENDING':

        this.menuItems =  [
          {title: 'View Order Details', iconName: 'tuiIconEye'},
          {title:'Update Delivery Status', iconName: 'tuiIconRefreshCw'},
          {title: 'Delete Order', iconName: 'tuiIconTrash'},
          {title: 'Download Receipt', iconName: 'tuiIconDownload'}
        ];

        break;

      case 'CANCELLED':

        this.menuItems =  [
          {title: 'View Order Details', iconName: 'tuiIconEye'},
          {title:'Update Delivery Status', iconName: 'tuiIconRefreshCw'},
          {title: 'Delete Order', iconName: 'tuiIconTrash'},
        ];

        break;

      case 'OUT_FOR_DELIVERY':

        this.menuItems =  [
          {title: 'View Order Details', iconName: 'tuiIconEye'},
          {title:'Update Delivery Status', iconName: 'tuiIconRefreshCw'},
          {title: 'Delete Order', iconName: 'tuiIconTrash'},
          {title: 'Download Receipt', iconName: 'tuiIconDownload'}
        ];

        break;

      case 'DELIVERED':

        this.menuItems =  [
          {title: 'View Order Details', iconName: 'tuiIconEye'},
          {title:'Update Delivery Status', iconName: 'tuiIconRefreshCw'},
          {title: 'Delete Order', iconName: 'tuiIconTrash'},
          {title: 'Download Receipt', iconName: 'tuiIconDownload'}
        ];
        break;
    }
  }

  get searchValue(){
    return this.search.getRawValue() as string;
  }

  handleContextMenu(event: {action:string, data: Order}) {

    switch (event.action) {
      case 'View Order Details':
       this.dialogs
          .open(
            new PolymorpheusComponent(ViewOrderDetailsComponent, this.injector),
            {
              size: 'auto',
              closeable: true,
              dismissible: true,
              data: event.data.id,
            },
          )
          .subscribe();
        break;
      case 'Update Delivery Status':
        const updateDeliveryDialog = this.dialogs
          .open(
            new PolymorpheusComponent(UpdateDeliveryStatusComponent, this.injector),
            {
              size: 'auto',
              closeable: true,
              dismissible: true,
              data: event.data,
            },
          )
          .subscribe();
        this.dialogSubscriptionService.dialog = updateDeliveryDialog;
        break;

      case 'Delete Order':

        break;

      case 'Download Receipt':
        this.orderService.downloadOrderPDF(event.data.id)
          .pipe(map(response=> {
            let contentDispositionHeader = response.headers.get('Content-Disposition')  || '';
            console.log(contentDispositionHeader);
            let result = contentDispositionHeader.split(';')[1].trim().split('=')[1];

            return {
              url : window.URL.createObjectURL(new Blob([response.body as Blob], {type: 'application/pdf'})),
              filename: result.replace(/"/g, '')
            }
          }))
          .subscribe(res=>{
            let link = document.createElement('a');
            link.href = res.url;
            link.download = res.filename;
            link.target = "_blank"
            link.click();
            window.URL.revokeObjectURL(link.href);
            link.remove();

            this.alertService.showAlert('PDF Downloaded', 'You can get the downloaded PDF from your folder', Status.SUCCESS);
          });

        break;
    }
  }

  exportCsv() {
    this.orderService.exportCsv()
      .subscribe({
        next:res=> {
          this.alertService.showAlert('Exported CSV Successfully', 'You may get the exported CSV from your folder', Status.SUCCESS);
        },
        error:err=>{

        }
      })
  }
}
