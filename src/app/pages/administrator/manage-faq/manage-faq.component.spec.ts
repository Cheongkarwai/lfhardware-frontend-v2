import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFaqComponent } from './manage-faq.component';

describe('ManageFaqComponent', () => {
  let component: ManageFaqComponent;
  let fixture: ComponentFixture<ManageFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
