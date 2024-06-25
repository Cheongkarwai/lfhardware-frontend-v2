import {Component, OnInit} from '@angular/core';
import {AccountConfirmationComponent} from "../customer-onboarding/account-confirmation/account-confirmation.component";
import {CommonModule} from "@angular/common";
import {RoleConfirmationComponent} from "../role-confirmation/role-confirmation.component";
import {
  SetupAccountVerificationComponent
} from "../customer-onboarding/setup-account-verification/setup-account-verification.component";
import {
  UpdateAccountDetailsComponent
} from "../customer-onboarding/update-account-details/update-account-details.component";
import {initFlowbite} from "flowbite";
import {BasicInfoComponent} from "./basic-info/basic-info.component";
import {BankingDetailsComponent} from "./banking-details/banking-details.component";
import {ServiceProviderSignupService} from "../../../core/service-provider/service-provider-signup.service";
import {DocumentAndCredentialsComponent} from "./document-and-credentials/document-and-credentials.component";
import {ProviderService} from "../../../core/service-provider/service-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest, map} from "rxjs";
import {ServiceProvider} from "../../../core/service-provider/service-provider.interface";

@Component({
  selector: 'app-service-provider-onboarding',
  standalone: true,
  imports: [
    AccountConfirmationComponent,
    CommonModule,
    RoleConfirmationComponent,
    SetupAccountVerificationComponent,
    UpdateAccountDetailsComponent,
    BasicInfoComponent,
    BankingDetailsComponent,
    DocumentAndCredentialsComponent
  ],
  templateUrl: './service-provider-onboarding.component.html',
  styleUrl: './service-provider-onboarding.component.scss'
})
export class ServiceProviderOnboardingComponent implements OnInit {

  provider$!: Observable<ServiceProvider>;

  // steps:string[]  = ['Basic Information', 'Document', 'Payment Details', 'Album'];
  // currentStep: string = 'Basic Information';

  constructor(private serviceProviderSignupService: ServiceProviderSignupService,
              private providerService: ProviderService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    initFlowbite();
    this.provider$ = combineLatest([this.providerService.findPaymentAccountStatus(),
      this.providerService.findCurrentServiceProvider()])
      .pipe(map(([status, serviceProvider]) => {

        if (serviceProvider) {
          this.serviceProviderSignupService.currentStepIndex = 1;
        }
        if ((serviceProvider.front_identity_card && serviceProvider.back_identity_card && serviceProvider.ssm)
          || !status) {
          this.serviceProviderSignupService.currentStepIndex = 2;
        }
        if (serviceProvider.stripe_account_id && status) {
          this.router.navigate(['completed'], {relativeTo: this.activatedRoute});
        }

        return serviceProvider;
      }))
    // this.providerService.findCurrentServiceProvider().subscribe({
    //   next: res => {
    //     if (res) {
    //       console.log(res);
    //       this.serviceProviderSignupService.currentStepIndex = 1;
    //
    //       if (res.front_identity_card && res.back_identity_card && res.ssm) {
    //         this.serviceProviderSignupService.currentStepIndex = 2;
    //       }
    //       if (res.stripe_account_id) {
    //         this.router.navigate(['completed'], {relativeTo: this.activatedRoute});
    //       }
    //     }
    //   },
    //   error: err => {
    //
    //   }
    // });
  }

  get currentStep() {
    return this.serviceProviderSignupService.currentStep;
  }

  get steps() {
    return this.serviceProviderSignupService.allSteps;
  }

  changeStep(step: string) {

    //this.currentStep = step;
  }
}
