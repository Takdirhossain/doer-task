import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttendanceResponse } from '../model/attendence.model';
import { API_URL } from '@app/constants/api.constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherAttendenceService {
    constructor(private http: HttpClient) {}
 getAttendence(filter: 'present' | 'absent' | 'late', page = 1, limit = 10): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${API_URL}/api/v1/attendance/get-today-attendance?filter=${filter}&page=${page}&limit=${limit}`);
  }

}
