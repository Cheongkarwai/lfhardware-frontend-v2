import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleConfirmationComponent } from './role-confirmation.component';

describe('RoleConfirmationComponent', () => {
  let component: RoleConfirmationComponent;
  let fixture: ComponentFixture<RoleConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
