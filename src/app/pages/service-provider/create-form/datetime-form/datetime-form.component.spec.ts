import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeFormComponent } from './datetime-form.component';

describe('DatetimeFormComponent', () => {
  let component: DatetimeFormComponent;
  let fixture: ComponentFixture<DatetimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatetimeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
