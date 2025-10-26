import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { API_URL } from '@app/constants/api.constant';
import { LoginResponse, SignUpModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  btnLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  btnLoading$: Observable<boolean> = this.btnLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    this.btnLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${API_URL}/api/v1/auth/login`, { username, password })
      .pipe(
        tap(() => this.btnLoadingSubject.next(false)),
        catchError(err => throwError(() => err?.error?.message || 'Login failed' ))
      );
  }
  signup(signupModel: SignUpModel): Observable<LoginResponse> {
    this.btnLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${API_URL}/api/v1/auth/signup`, signupModel)
      .pipe(
        tap(() => this.btnLoadingSubject.next(false)),
        catchError(err => throwError(() => err?.error?.message || 'Signup failed'))
      );
  }
  logout(): Observable<void> {
    this.btnLoadingSubject.next(true);

    return this.http.get<void>(`${API_URL}/api/v1/auth/logout`,{})
      .pipe(
        tap(() => this.btnLoadingSubject.next(false)),
        catchError(err => throwError(() => err?.error?.message || 'Logout failed'))
      );
  }
}
