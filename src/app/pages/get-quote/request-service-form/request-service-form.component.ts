import {Component, OnInit} from '@angular/core';
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiDataListWrapperModule, TuiRatingModule, TuiSelectModule, TuiTagModule} from "@taiga-ui/kit";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ServiceProviderDetails} from "../../../core/service-provider/service-provider-details";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {ActivatedRoute, Router, RouterModule, RouterOutlet} from "@angular/router";
import {Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {LoadingSpinnerComponent} from "../../../components/loading-spinner/loading-spinner.component";
import {DynamicFormComponent} from "../../../components/dynamic-form/dynamic-form.component";
import {FormLayout} from "../../../core/form/form-layout.interface";
import {FormConfiguration} from "../../../core/form/form-configuration.interface";
import {ContactDetailsComponent} from "./form/contact-details/contact-details.component";

@Component({
  selector: 'app-request-service-form',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiRatingModule,
    TuiTagModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    RouterModule,
    DynamicFormComponent,
    ContactDetailsComponent
  ],
  templateUrl: './request-service-form.component.html',
  styleUrl: './request-service-form.component.scss'
})
export class RequestServiceFormComponent implements OnInit{
  firstRate = 2;

  $serviceProviderDetails:Observable<ServiceProviderDetails>;

  $layout!:Observable<FormConfiguration>;
  service:FormControl;


  constructor(private providerService:ProviderService, private activatedRoute: ActivatedRoute, private fb:FormBuilder,
              private router:Router) {
    const id = activatedRoute.parent?.snapshot.params['id'] as string;
    activatedRoute.parent?.params.subscribe(res=>console.log(id.substring(5,id.length)));
    this.$serviceProviderDetails = this.providerService.findById(id.substring(4,id.length));
    this.service = new FormControl();
    //this.$layout = this.providerService.findServiceProviderForm(70,1);
  }
  ngOnInit() {
    //this.$serviceProviderDetails = this.providerService.findById();

  }

  selectService(event: any) {
    console.log(event.target.value);
    this.router.navigate(['aircond-installation'])
  }
}
