import { TestBed } from '@angular/core/testing';

import { TeacherAttendenceService } from './teacher-attendence-service';

describe('TeacherAttendenceService', () => {
  let service: TeacherAttendenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherAttendenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
