
export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceDataWrapper;
}

export interface AttendanceDataWrapper {
  success: boolean;
  data: Attendance[];
  pagination: Pagination;
}

export interface Attendance {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;        
  status: 'PRESENT' | 'ABSENT' | 'LATE' | string; 
  remarks: string | null;
  markedAt: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
  teacher: Teacher;
}

export interface Teacher {
  id: string;
  username: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
