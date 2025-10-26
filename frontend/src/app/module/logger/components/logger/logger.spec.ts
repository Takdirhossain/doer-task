import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Logger } from './logger';

describe('Logger', () => {
  let component: Logger;
  let fixture: ComponentFixture<Logger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Logger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
