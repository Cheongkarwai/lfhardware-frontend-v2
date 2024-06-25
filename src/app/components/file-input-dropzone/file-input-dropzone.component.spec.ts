import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputDropzoneComponent } from './file-input-dropzone.component';

describe('FileInputDropzoneComponent', () => {
  let component: FileInputDropzoneComponent;
  let fixture: ComponentFixture<FileInputDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInputDropzoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileInputDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
