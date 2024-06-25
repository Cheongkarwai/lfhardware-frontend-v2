import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { serviceProviderOnboardingGuard } from './user-onboarding-completed';

describe('serviceProviderOnboardingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => serviceProviderOnboardingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
