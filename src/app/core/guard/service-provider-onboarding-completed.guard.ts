import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ProviderService} from "../service-provider/service-provider.service";
import {map, combineLatest} from "rxjs";

export const serviceProviderOnboardingCompletedGuard: CanActivateFn = (route, state) => {
  const providerService = inject(ProviderService);
  const router = inject(Router);

  return combineLatest([providerService.findCurrentServiceProvider().pipe(map(serviceProvider => {
    return !(serviceProvider && serviceProvider.front_identity_card
      && serviceProvider.back_identity_card
      && serviceProvider.ssm &&
      serviceProvider.stripe_account_id);

  })),
    providerService.findPaymentAccountStatus()])
    .pipe(map(([details, accountStatus])=>{
      if(!details && accountStatus){
        router.navigateByUrl('');
        return false;
      }
      return true;
  }));

};
