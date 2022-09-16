import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpErrorComponent } from './ip-error.component';

describe('IpErrorComponent', () => {
  let component: IpErrorComponent;
  let fixture: ComponentFixture<IpErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
