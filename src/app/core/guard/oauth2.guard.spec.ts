import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { oauth2Guard } from './oauth2.guard';

describe('oauth2Guard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => oauth2Guard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
