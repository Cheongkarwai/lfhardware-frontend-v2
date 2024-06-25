import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupAccountVerificationComponent } from './setup-account-verification.component';

describe('SetupAccountVerificationComponent', () => {
  let component: SetupAccountVerificationComponent;
  let fixture: ComponentFixture<SetupAccountVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupAccountVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupAccountVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
