import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAndCredentialsComponent } from './document-and-credentials.component';

describe('DocumentAndCredentialsComponent', () => {
  let component: DocumentAndCredentialsComponent;
  let fixture: ComponentFixture<DocumentAndCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentAndCredentialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentAndCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
