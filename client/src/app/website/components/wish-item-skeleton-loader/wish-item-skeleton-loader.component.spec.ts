import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishItemSkeletonLoaderComponent } from './wish-item-skeleton-loader.component';

describe('WishItemSkeletonLoaderComponent', () => {
  let component: WishItemSkeletonLoaderComponent;
  let fixture: ComponentFixture<WishItemSkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishItemSkeletonLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishItemSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
