import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '@app/constants/api.constant';
import { AttendanceResponse } from '../model/attendence-history.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentAttendenceService {
  constructor(private http: HttpClient) { }
  markAttendance() {
    return this.http.get(`${API_URL}/api/v1/attendance/present`, {});
  }
  getAttendenceHistory({page, limit}: {page: number, limit: number}): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${API_URL}/api/v1/attendance/get-present-history`, {params: {page, limit}});
  }
}
