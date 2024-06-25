import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterKeywordComponent } from './filter-keyword.component';

describe('FilterKeywordComponent', () => {
  let component: FilterKeywordComponent;
  let fixture: ComponentFixture<FilterKeywordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterKeywordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
