import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SofaMattressCleaningComponent } from './sofa-mattress-cleaning.component';

describe('SofaMattressCleaningComponent', () => {
  let component: SofaMattressCleaningComponent;
  let fixture: ComponentFixture<SofaMattressCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SofaMattressCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SofaMattressCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
