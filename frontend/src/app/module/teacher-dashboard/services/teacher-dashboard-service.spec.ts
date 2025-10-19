import { TestBed } from '@angular/core/testing';

import { TeacherDashboardService } from './teacher-dashboard-service';

describe('TeacherDashboardService', () => {
  let service: TeacherDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
