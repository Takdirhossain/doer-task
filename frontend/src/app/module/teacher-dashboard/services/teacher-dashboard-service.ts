import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@app/constants/api.constant';
import { AttendanceResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${API_URL}/api/v1/attendance/get-today-attendance`);
  }
}
