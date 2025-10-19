import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetLogsResponse, Pagination } from '../model/login-log.model';
import { API_URL } from '@app/constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class LoginLogService {
   constructor(private http: HttpClient) {}

   getLogs(pagination: Pagination): Observable<GetLogsResponse> {
       const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('limit', pagination.limit.toString());
      return this.http.get<GetLogsResponse>(API_URL + '/api/v1/logs/get-logs', {params: params});
    }
  }