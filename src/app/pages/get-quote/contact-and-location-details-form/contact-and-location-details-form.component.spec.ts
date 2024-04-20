import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAndLocationDetailsFormComponent } from './contact-and-location-details-form.component';

describe('ContactAndLocationDetailsFormComponent', () => {
  let component: ContactAndLocationDetailsFormComponent;
  let fixture: ComponentFixture<ContactAndLocationDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAndLocationDetailsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactAndLocationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
