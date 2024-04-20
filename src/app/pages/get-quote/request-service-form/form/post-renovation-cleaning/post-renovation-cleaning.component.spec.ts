import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRenovationCleaningComponent } from './post-renovation-cleaning.component';

describe('PostRenovationCleaningComponent', () => {
  let component: PostRenovationCleaningComponent;
  let fixture: ComponentFixture<PostRenovationCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostRenovationCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostRenovationCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
