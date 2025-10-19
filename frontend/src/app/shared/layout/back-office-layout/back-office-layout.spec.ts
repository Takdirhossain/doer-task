import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeLayout } from './back-office-layout';

describe('BackOfficeLayout', () => {
  let component: BackOfficeLayout;
  let fixture: ComponentFixture<BackOfficeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackOfficeLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackOfficeLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
