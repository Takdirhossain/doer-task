export interface Student {
  username: string;
  email: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  className: string;
  dateOfBirth: string; 
  rollNumber: number;
  password_hash: string;
  address: string;
}

export interface StudentResponse {
  success: boolean;
  uniqueCount: number;
  duplicateCount: number;
  uniqueUsers: Student[];
  duplicateUsers: Student[];
}
