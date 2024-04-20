import {Component, Inject} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {OrderService} from "../../../core/order/order.service";
import {Observable} from "rxjs";
import {Order} from "../../../core/order/order.interface";
import {CommonModule} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {OrderDetails} from "../../../core/order/order-details.interface";
import {
  TuiPdfViewerModule,
  TuiPdfViewerOptions,
  TuiPdfViewerService,
  TuiStepperModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {RemoveUnderscorePipe} from "../../../core/pipe/remove-underscore.pipe";
import {TuiButtonModule, TuiNotificationModule} from "@taiga-ui/core";
import {DomSanitizer} from "@angular/platform-browser";
import {TUI_IS_MOBILE} from "@taiga-ui/cdk";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, TuiStepperModule, RemoveUnderscorePipe, TuiTagModule, TuiButtonModule, TuiNotificationModule, TuiPdfViewerModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {

  selectedOrderId!:string;

  order$!:Observable<OrderDetails>;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private orderService:OrderService,
              @Inject(DomSanitizer) private readonly sanitizer: DomSanitizer,
              @Inject(TuiPdfViewerService) private readonly pdfService: TuiPdfViewerService,
              @Inject(TUI_IS_MOBILE) private readonly isMobile: boolean,) {
    const id = this.activatedRoute.snapshot.params['id'] as string;
    this.selectedOrderId = id.substring(3,id.length);
    this.order$ = orderService.findById(Number(this.selectedOrderId));
  }

  private readonly pdf = 'assets/media/taiga.pdf';

  open = false;

  /**
   * @description:
   * Embedded PDFs in mobile doesn't work,
   * so you can use third-party services
   * or your own service to render PDF in mobile iframe
   */
  readonly src = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.isMobile
      ? `https://drive.google.com/viewerng/viewer?embedded=true&url=https://taiga-ui.dev/${this.pdf}`
      : this.pdf,
  );
  show(actions: PolymorpheusComponent<TuiPdfViewerOptions>): void {
    this.pdfService
      .open(
        this.sanitizer.bypassSecurityTrustResourceUrl(
          this.isMobile
            ? `https://drive.google.com/viewerng/viewer?embedded=true&url=https://taiga-ui.dev/${this.pdf}`
            : this.pdf,
        ),
        {
          label: 'Taiga UI',
          actions,
        },
      )
      .subscribe();
  }


}
