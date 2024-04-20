import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisinfectionServicesComponent } from './disinfection-services.component';

describe('DisinfectionServicesComponent', () => {
  let component: DisinfectionServicesComponent;
  let fixture: ComponentFixture<DisinfectionServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisinfectionServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisinfectionServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
