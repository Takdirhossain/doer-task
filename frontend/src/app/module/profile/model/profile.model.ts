export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface Profile {
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
  role: 'STUDENT' | 'TEACHER'  | string; 
  status: 'ACTIVE' | 'INACTIVE'  | string;
  createdAt: string;
  updatedAt: string;
}
