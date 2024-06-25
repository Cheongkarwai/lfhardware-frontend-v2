import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ProviderService} from "../service-provider/service-provider.service";
import {map, combineLatest} from "rxjs";
import {ServiceProviderSignupService} from "../service-provider/service-provider-signup.service";
import {CustomerService} from "../customer/customer.service";

export const userOnboardingCompletedGuard: CanActivateFn = (route, state) => {

    const providerService = inject(ProviderService);
    const customerService = inject(CustomerService);
    const router = inject(Router);

    return combineLatest([customerService.findCurrentCustomer()
      .pipe(map(customer => !customer)), providerService.findCurrentServiceProvider().pipe(map(serviceProvider => {
      if (serviceProvider && serviceProvider.front_identity_card
        && serviceProvider.back_identity_card
        && serviceProvider.ssm &&
        serviceProvider.stripe_account_id) {
       // router.navigateByUrl('user-onboarding/service-provider/completed')
        return false;
      }
      return true;
    }))]).pipe(map(result => {
      if (result[0] && result[1]) {
        router.navigateByUrl('user-onboarding');
        return false;
      }
      return true;
      //return !(result[0] && result[1]);
    }));
  }
;
