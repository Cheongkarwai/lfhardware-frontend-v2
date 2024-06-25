import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentProgressBarComponent } from './appointment-progress-bar.component';

describe('AppointmentProgressBarComponent', () => {
  let component: AppointmentProgressBarComponent;
  let fixture: ComponentFixture<AppointmentProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentProgressBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
