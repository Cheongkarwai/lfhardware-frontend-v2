import {Component, OnInit} from '@angular/core';
import {SurveyModule} from "survey-angular-ui";
import {FormService} from "../../../core/form/form.service";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {ActivatedRoute} from "@angular/router";
import {map, Observable, of, startWith, switchMap} from "rxjs";
import {Model} from "survey-core";
import {CommonModule} from "@angular/common";
import {DropdownComponent, DropdownItem} from "../../../components/dropdown/dropdown.component";
import {FormControl, Validators} from "@angular/forms";
import {ProviderBusinessService} from "../../../core/service-provider/provider-business.service";
import {ServiceProviderDetails} from "../../../core/service-provider/service-provider-details";

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [SurveyModule, CommonModule, DropdownComponent],
  templateUrl: './service-request.html',
  styleUrl: './service-request.scss'
})
export class ServiceRequest implements OnInit {

  serviceProviderId: string = '';
  appointmentForm$!: Observable<Model>;
  services$!: Observable<DropdownItem[]>;
  serviceProvider$!: Observable<ServiceProviderDetails>;
  selectServiceControl: FormControl = new FormControl<number>(0, Validators.required);

  constructor(private formService: FormService,
              private providerService: ProviderService,
              private providerBusinessService: ProviderBusinessService,
              private activatedRoute: ActivatedRoute,
  ) {
    this.serviceProviderId = activatedRoute.snapshot.params['id'] as string;
  }

  ngOnInit() {
    this.serviceProvider$ = this.providerService.findById(this.serviceProviderId);
    this.services$ = this.providerService.findServiceProviderServicesById(this.serviceProviderId)
      .pipe(map(services => services.map(service => {
        return {
          title: service.name,
          value: service.id
        };
      })));
    this.appointmentForm$ = this.selectServiceControl.valueChanges.pipe(startWith(null), switchMap((serviceId: number) => {
      if(serviceId){
        return this.providerService.findServiceProviderForm(this.serviceProviderId, serviceId)
          .pipe(map(form => {
            if(form){
              return new Model(form.configuration)
            }
            return new Model();
          }));
      }
      return of(new Model());
    }))
  }

}
