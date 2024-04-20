import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveInMoveOutCleaningComponent } from './move-in-move-out-cleaning.component';

describe('MoveInMoveOutCleaningComponent', () => {
  let component: MoveInMoveOutCleaningComponent;
  let fixture: ComponentFixture<MoveInMoveOutCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveInMoveOutCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveInMoveOutCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
