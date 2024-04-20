import {Component, Inject} from '@angular/core';
import {Observable} from "rxjs";
import {ServiceProviderDetails} from "../../../../../core/service-provider/service-provider-details";
import {ProviderService} from "../../../../../core/service-provider/service-provider.service";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {TuiDialogContext} from "@taiga-ui/core";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-view-service-provider',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './view-service-provider.component.html',
  styleUrl: './view-service-provider.component.scss'
})
export class ViewServiceProviderComponent {

  serviceProviderDetails$:Observable<ServiceProviderDetails>;

  constructor(private providerService:ProviderService, @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>) {
    const id = this.context.data as any;
    this.serviceProviderDetails$ = providerService.findById(id);
  }
}
