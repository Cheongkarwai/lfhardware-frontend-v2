import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReviewComponent } from './appointment-review.component';

describe('AppointmentReviewComponent', () => {
  let component: AppointmentReviewComponent;
  let fixture: ComponentFixture<AppointmentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
