import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpViaAuthenticatorAppComponent } from './otp-via-authenticator-app.component';

describe('OtpViaAuthenticatorAppComponent', () => {
  let component: OtpViaAuthenticatorAppComponent;
  let fixture: ComponentFixture<OtpViaAuthenticatorAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpViaAuthenticatorAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpViaAuthenticatorAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
