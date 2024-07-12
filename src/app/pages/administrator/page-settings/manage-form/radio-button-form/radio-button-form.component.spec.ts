import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonFormComponent } from './radio-button-form.component';

describe('RadioButtonFormComponent', () => {
  let component: RadioButtonFormComponent;
  let fixture: ComponentFixture<RadioButtonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadioButtonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
