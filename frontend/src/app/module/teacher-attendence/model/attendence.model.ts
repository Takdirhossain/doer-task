export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceData;
}

export interface AttendanceData {
  success: boolean;
  filter: string;            
  totalStudents: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: AttendanceStats;
  data: StudentAttendance[];
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
}

export interface StudentAttendance {
  studentId: string;
  name: string;
  username: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}
