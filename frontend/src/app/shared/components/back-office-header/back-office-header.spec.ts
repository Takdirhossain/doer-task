import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeHeader } from './back-office-header';

describe('BackOfficeHeader', () => {
  let component: BackOfficeHeader;
  let fixture: ComponentFixture<BackOfficeHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackOfficeHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackOfficeHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
