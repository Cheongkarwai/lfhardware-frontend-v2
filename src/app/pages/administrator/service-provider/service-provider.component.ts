import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {Observable} from "rxjs";
import {Pageable} from "../../../core/page/pagination.interface";
import {ServiceProvider} from "../../../core/service-provider/service-provider.interface";
import {ServiceProviderRequest} from "../../../core/service-provider/service-provider-request.interface";

@Component({
  selector: 'app-service-provider',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './service-provider.component.html',
  styleUrl: './service-provider.component.scss'
})
export class ServiceProviderComponent {

}
