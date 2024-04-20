import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDirectoryComponent } from './service-directory.component';

describe('ServiceDirectoryComponent', () => {
  let component: ServiceDirectoryComponent;
  let fixture: ComponentFixture<ServiceDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDirectoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
