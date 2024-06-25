import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { serviceProviderGuard } from './service-provider.guard';

describe('serviceProviderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => serviceProviderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
