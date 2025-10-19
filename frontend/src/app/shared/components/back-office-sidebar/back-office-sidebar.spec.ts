import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeSidebar } from './back-office-sidebar';

describe('BackOfficeSidebar', () => {
  let component: BackOfficeSidebar;
  let fixture: ComponentFixture<BackOfficeSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackOfficeSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackOfficeSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
