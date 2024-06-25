import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userOnboardingGuard } from './user-onboarding.guard';

describe('userOnboardingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userOnboardingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
