import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '@app/constants/api.constant';
import { RolesResponse } from '../model/roles.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient) { }

  getRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(API_URL + '/api/v1/authorization/get-roles');
  }
}
