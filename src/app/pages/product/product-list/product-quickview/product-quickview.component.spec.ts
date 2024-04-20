import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQuickviewComponent } from './product-quickview.component';

describe('ProductQuickviewComponent', () => {
  let component: ProductQuickviewComponent;
  let fixture: ComponentFixture<ProductQuickviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductQuickviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductQuickviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
