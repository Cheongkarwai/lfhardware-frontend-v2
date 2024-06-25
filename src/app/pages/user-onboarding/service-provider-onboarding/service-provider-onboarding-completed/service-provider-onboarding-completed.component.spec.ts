import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderOnboardingCompletedComponent } from './service-provider-onboarding-completed.component';

describe('ServiceProviderOnboardingCompletedComponent', () => {
  let component: ServiceProviderOnboardingCompletedComponent;
  let fixture: ComponentFixture<ServiceProviderOnboardingCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceProviderOnboardingCompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceProviderOnboardingCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
