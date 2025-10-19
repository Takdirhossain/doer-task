export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceDataWrapper;
}

export interface AttendanceDataWrapper {
  success: boolean;
  studentId: string;
  year: number;
  totalWorkingDays: number;
  totalPresent: number;
  totalAbsent: number;
}
