import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogLog } from './log-log';

describe('LogLog', () => {
  let component: LogLog;
  let fixture: ComponentFixture<LogLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
