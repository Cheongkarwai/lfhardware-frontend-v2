import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderOnboardingComponent } from './service-provider-onboarding.component';

describe('ServiceProviderOnboardingComponent', () => {
  let component: ServiceProviderOnboardingComponent;
  let fixture: ComponentFixture<ServiceProviderOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceProviderOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceProviderOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
