import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '@app/constants/api.constant';
import { ProfileResponse } from '../model/profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }
  getUserProfile(id:string):Observable<ProfileResponse>{
    return this.http.get(`${API_URL}/api/v1/students/${id}`) as Observable<ProfileResponse>
  }
  updateUserProfile(id:string,data:any):Observable<ProfileResponse>{
    return this.http.post(`${API_URL}/api/v1/students/profile-update/${id}`,data) as Observable<ProfileResponse>
  }
  
}
