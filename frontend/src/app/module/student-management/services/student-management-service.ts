import { Injectable } from '@angular/core';
import { API_URL } from '@app/constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentResponse } from '../models/student-management.model';
import { StudentListResponse } from '../models/student-list.model';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  constructor(private http: HttpClient) {}

  uploadCsv(formData: FormData): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(API_URL + '/api/v1/students/process-csv', formData);
  }
  saveCsv(): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(API_URL + '/api/v1/students/save-csv', {});
  }
  getStudents(page: number, limit: number, searchTerm?: string): Observable<StudentListResponse> {
    return this.http.get<StudentListResponse>(API_URL + '/api/v1/students/student-list?page=' + page + '&limit=' + limit + '&search=' + searchTerm);
  }
  addStudent(student:any) {
    return this.http.post<StudentResponse>(API_URL + '/api/v1/students', student);
  }
}
