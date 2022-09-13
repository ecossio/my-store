import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentComponent } from './page-content.component';

describe('AccountPageComponent', () => {
  let component: PageContentComponent;
  let fixture: ComponentFixture<PageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
