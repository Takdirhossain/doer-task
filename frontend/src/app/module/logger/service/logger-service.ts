import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerResponse } from '../model/logger.model';
import { Observable } from 'rxjs';
import { API_URL } from '@app/constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private http: HttpClient) { }
  getLogger(page: number, limit: number): Observable<LoggerResponse> {
    return this.http.get<LoggerResponse>(API_URL + `/api/v1/logs/get-logger?page=${page}&limit=${limit}`);
  }

  
}
