import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {ServiceProviderDetails} from "../../../../../core/service-provider/service-provider-details";
import {ProviderService} from "../../../../../core/service-provider/service-provider.service";
import {POLYMORPHEUS_CONTEXT, PolymorpheusContent, PolymorpheusModule} from "@tinkoff/ng-polymorpheus";
import {TuiAlertService, TuiButtonModule, TuiDialogContext, TuiRootModule} from "@taiga-ui/core";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BadgeComponent} from "../../../../../components/badge/badge.component";
import {DocumentPreviewComponent} from "../../../../../components/document-preview/document-preview.component";
import {PreviewButtonComponent} from "../../../../../components/preview-button/preview-button.component";
import {TuiPreviewActionModule, TuiPreviewDialogService, TuiPreviewModule} from "@taiga-ui/addon-preview";
import {tuiClamp, TuiSwipe, TuiSwipeModule} from "@taiga-ui/cdk";
import {FileService} from "../../../../../core/file/file.service";
import {DownloadButtonComponent} from "../../../../../components/download-button/download-button.component";
import {
  ImagePreviewComponent
} from "../../../../service-provider/manage-appointment/image-preview/image-preview.component";
import {ButtonComponent} from "../../../../../components/button/button.component";
import {ToastService} from "../../../../../core/dialog/toast.service";
import {ConfirmationDialogComponent} from "../../../../../components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-view-service-provider',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    BadgeComponent,
    DocumentPreviewComponent,
    PreviewButtonComponent,
    TuiRootModule,
    PolymorpheusModule,
    TuiButtonModule,
    TuiPreviewActionModule,
    TuiPreviewModule,
    TuiSwipeModule,
    DownloadButtonComponent,
    ButtonComponent,
  ],
  templateUrl: './view-service-provider.component.html',
  styleUrl: './view-service-provider.component.scss'
})
export class ViewServiceProviderComponent {

  serviceProviderDetails$!: Observable<ServiceProviderDetails>;


  constructor(private providerService: ProviderService,
              @Inject(MAT_DIALOG_DATA) public data: { serviceProviderId: string },
              private dialogRef: MatDialogRef<ViewServiceProviderComponent>,
              private fileService: FileService,
              private dialog: MatDialog,
              private toastService: ToastService) {
  }


  closeModal() {
    this.dialogRef.close();
  }

  update(serviceProviderDetails: ServiceProviderDetails) {

  }

  ngOnInit() {
    this.serviceProviderDetails$ = this.providerService.findById(this.data.serviceProviderId);
  }


  download() {
    //this.fileService.downloadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREoRGyXmHy_6aIgXYqWHdOT3KjfmnuSyxypw&s");

    this.dialog.open(ImagePreviewComponent, {
      data: {
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREoRGyXmHy_6aIgXYqWHdOT3KjfmnuSyxypw&s']
      }
    });
  }

  preview(...images: string[]) {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        images: images
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Approve',
        text: 'You are about to approve service provider account',
        icon: 'warning'
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.providerService.updateStatus(id, {status: status}).subscribe({
          next: res => {
            this.dialogRef.close();
            this.dialogRef.afterClosed().subscribe({
              next:res=>{
                this.toastService.open(`Service Provider ID - ${id} has been approved`, 'success');
                this.providerService.refresh.next();
              }
            })
          }
        });
      }
    });
  }
}
