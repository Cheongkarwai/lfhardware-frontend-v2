import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionDetailsComponent } from './view-transaction-details.component';

describe('ViewTransactionDetailsComponent', () => {
  let component: ViewTransactionDetailsComponent;
  let fixture: ComponentFixture<ViewTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTransactionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
