import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiceProviderComponent } from './manage-service-provider.component';

describe('ManageServiceProviderComponent', () => {
  let component: ManageServiceProviderComponent;
  let fixture: ComponentFixture<ManageServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageServiceProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
