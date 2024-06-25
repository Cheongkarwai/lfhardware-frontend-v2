import {Component, OnInit} from '@angular/core';
import {AccountConfirmationComponent} from "./account-confirmation/account-confirmation.component";
import {CommonModule, NgIf} from "@angular/common";
import {RoleConfirmationComponent} from "../role-confirmation/role-confirmation.component";
import {SetupAccountVerificationComponent} from "./setup-account-verification/setup-account-verification.component";
import {UpdateAccountDetailsComponent} from "./update-account-details/update-account-details.component";
import {catchError, map, Observable} from "rxjs";
import {Customer} from "../../../core/customer/customer.interface";
import {HttpClient} from "@angular/common/http";
import {CustomerService} from "../../../core/customer/customer.service";
import {BankingDetailsComponent} from "./banking-details/banking-details.component";

@Component({
  selector: 'app-customer-onboarding',
  standalone: true,
  imports: [
    AccountConfirmationComponent,
    CommonModule,
    RoleConfirmationComponent,
    SetupAccountVerificationComponent,
    UpdateAccountDetailsComponent,
    BankingDetailsComponent
  ],
  templateUrl: './customer-onboarding.component.html',
  styleUrl: './customer-onboarding.component.scss'
})
export class CustomerOnboardingComponent implements OnInit{

  step = 'Update Account';

  changeStep(step: string){
    this.step = step;
  }

  constructor(private customerService: CustomerService) {
  }

  ngOnInit() {
    this.customerService.findCurrentCustomer()
      .subscribe(customer=>{
        if(customer){
          this.step = 'Setup Account Verification';
        }
      });
  }

}
