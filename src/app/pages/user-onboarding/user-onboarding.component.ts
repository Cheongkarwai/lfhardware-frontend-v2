import { Component } from '@angular/core';
import {PhoneInputComponent} from "../../components/phone-input/phone-input.component";
import {ZipcodeInputComponent} from "../../components/zipcode-input/zipcode-input.component";
import {CommonModule, NgSwitch, NgSwitchCase} from "@angular/common";
import {UpdateAccountDetailsComponent} from "./customer-onboarding/update-account-details/update-account-details.component";
import {SetupAccountVerificationComponent} from "./customer-onboarding/setup-account-verification/setup-account-verification.component";
import {AccountConfirmationComponent} from "./customer-onboarding/account-confirmation/account-confirmation.component";
import {RoleConfirmationComponent} from "./role-confirmation/role-confirmation.component";
import {RouterModule, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-user-onboarding',
  standalone: true,
  imports: [
    PhoneInputComponent,
    ZipcodeInputComponent,
    UpdateAccountDetailsComponent,
    CommonModule,
    SetupAccountVerificationComponent,
    AccountConfirmationComponent,
    RoleConfirmationComponent,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './user-onboarding.component.html',
  styleUrl: './user-onboarding.component.scss'
})
export class UserOnboardingComponent {

  step = 'Role Confirmation'

  changeStep(step: string){
    this.step = step;
  }

}
