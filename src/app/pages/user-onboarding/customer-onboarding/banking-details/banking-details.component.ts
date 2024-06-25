import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ServiceProviderSignupService} from "../../../../core/service-provider/service-provider-signup.service";
import {DropdownCheckboxComponent} from "../../../../components/dropdown-checkbox/dropdown-checkbox.component";
import {AccountService} from "../../../../core/user/account.service";

@Component({
  selector: 'app-banking-details',
  standalone: true,
  imports: [
    CommonModule,
    DropdownCheckboxComponent,
  ],
  templateUrl: './banking-details.component.html',
  styleUrl: './banking-details.component.scss'
})
export class BankingDetailsComponent implements OnInit {

  constructor(private serviceProviderSignupFormService:ServiceProviderSignupService,
              private accountService: AccountService) {
  }

  ngOnInit() {

    this.accountService.createStripeAccount()
      .subscribe({
        next:res=> {
          window.location.href = res;
          //window.open(res, 'Popup', "width=600,height=600,scrollbars=yes,resizable=no")
        }
      })
  }


}
