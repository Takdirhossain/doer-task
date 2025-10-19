import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '@app/constants/api.constant';
import { AttendanceResponse } from '../model/dashboard.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}
  getDashboardData(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${API_URL}/api/v1/attendance/get-student-yearly-stats`);
  }
}
