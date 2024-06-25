import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ProviderService} from "../service-provider/service-provider.service";
import {CustomerService} from "../customer/customer.service";
import {combineLatest, map} from "rxjs";

export const userOnboardingGuard: CanActivateFn = (route, state) => {
  const providerService = inject(ProviderService);
  const customerService = inject(CustomerService);
  const router = inject(Router);

  return combineLatest([customerService.findCurrentCustomer()
    .pipe(map(customer => !customer)), providerService.findCurrentServiceProvider().pipe(map(serviceProvider => {
    return !(serviceProvider && serviceProvider.front_identity_card
      && serviceProvider.back_identity_card
      && serviceProvider.ssm &&
      serviceProvider.stripe_account_id);

  })), providerService.findPaymentAccountStatus()]).pipe(map(result => {
    if (result[0] && (!result[1] || !result[2])) {
      // router.navigateByUrl('user-onboarding');
      return true;
    }
    router.navigateByUrl('');
    return false;
    //return !(result[0] && result[1]);
  }));
};
