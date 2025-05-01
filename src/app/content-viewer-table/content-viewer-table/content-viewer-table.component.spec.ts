import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentViewerTableComponent } from './content-viewer-table.component';

describe('ContentViewerTableComponent', () => {
  let component: ContentViewerTableComponent;
  let fixture: ComponentFixture<ContentViewerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentViewerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentViewerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
