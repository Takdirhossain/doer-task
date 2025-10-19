export interface StudentListResponse {
  success: boolean;
  message: string;
  data: StudentListData;
}

export interface StudentListData {
  total: number;
  page: number;
  pages: number;
  students: StudentList[];
}

export interface StudentList {
  id: string;
  userId: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  class: string;
  rollNumber: number;
  dateOfBirth: string; 
  parentContact: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  mobileNumber: string;
  role: 'STUDENT'; 
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  updatedAt: string;
}
