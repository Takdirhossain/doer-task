import { TestBed } from '@angular/core/testing';

import { StudentAttendenceService } from './student-attendence-service';

describe('StudentAttendenceService', () => {
  let service: StudentAttendenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAttendenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
