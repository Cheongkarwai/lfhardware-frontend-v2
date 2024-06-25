import {Component, OnInit} from '@angular/core';
import {Model} from "survey-core";
import {FormService} from "../../core/form/form.service";
import {map, Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {SurveyModule} from "survey-angular-ui";
import {initFlowbite} from "flowbite";
import {ProviderService} from "../../core/service-provider/service-provider.service";
import {Service} from "../../core/service-provider/service.interface";

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, SurveyModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {

  bookingFormModel$!: Observable<Model>;
  serviceProviderId!: string;
  services$!: Observable<Service[]>;
  selectedService!: Service;

  constructor(private formService: FormService, private activatedRoute: ActivatedRoute,
              private providerService: ProviderService) {
    this.serviceProviderId = activatedRoute.snapshot.queryParams['service_provider_id'];
  }

  ngOnInit() {
    initFlowbite();
    this.bookingFormModel$ = this.formService.findFormConfiguration(Number(this.serviceProviderId), 1)
      .pipe(map(form => new Model(form.configuration)));
    this.services$ = this.providerService.findById(this.serviceProviderId)
      .pipe(map(provider=> {
        this.selectedService = provider.services[0];
        return provider.services;
      }));
  }

  changeForm(service: Service) {
    this.selectedService = service;
  }
}
