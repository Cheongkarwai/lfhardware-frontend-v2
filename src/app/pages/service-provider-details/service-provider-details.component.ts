import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ProviderService} from "../../core/service-provider/service-provider.service";
import {map, Observable} from "rxjs";
import {ServiceProviderDetails} from "../../core/service-provider/service-provider-details";
import {TuiCarouselModule, TuiRatingModule} from "@taiga-ui/kit";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {ButtonComponent} from "../../components/button/button.component";

@Component({
  selector: 'app-service-provider-details',
  standalone: true,
  imports: [CommonModule, TuiRatingModule, ReactiveFormsModule, TuiCarouselModule, RouterLink, BreadcrumbComponent, ButtonComponent],
  templateUrl: './service-provider-details.component.html',
  styleUrl: './service-provider-details.component.scss'
})
export class ServiceProviderDetailsComponent implements OnInit{

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Service',
      routerLink: ''
    },

  ];

  serviceProviderId!:string;

  serviceProviderDetails$!:Observable<ServiceProviderDetails>;
  ratingFormControl = new FormControl(0);

  items = [1,2,3,4,5];
  index = 0;

  constructor(private activatedRoute:ActivatedRoute, private serviceProviderService:ProviderService) {
    this.serviceProviderId = activatedRoute.snapshot.params['id'] as string;
    this.breadcrumbItems.push({caption: 'Details', routerLink: ''})
    this.getServiceProviderDetails(Number(this.serviceProviderId));
  }

  ngOnInit() {

  }

  getServiceProviderDetails(id:number){
    this.serviceProviderDetails$ = this.serviceProviderService.findById(id).pipe(map(serviceProvider=>{
      this.ratingFormControl.setValue(serviceProvider.rating);
      return serviceProvider;
    }));
  }


}
