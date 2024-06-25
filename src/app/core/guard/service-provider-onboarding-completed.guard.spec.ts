import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { serviceProviderOnboardingCompletedGuard } from './service-provider-onboarding-completed.guard';

describe('serviceProviderOnboardingCompletedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => serviceProviderOnboardingCompletedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
