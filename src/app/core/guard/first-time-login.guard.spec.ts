import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { firstTimeLoginGuard } from './first-time-login.guard';

describe('firstTimeLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => firstTimeLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
