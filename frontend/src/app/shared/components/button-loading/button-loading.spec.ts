import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLoading } from './button-loading';

describe('ButtonLoading', () => {
  let component: ButtonLoading;
  let fixture: ComponentFixture<ButtonLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLoading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
