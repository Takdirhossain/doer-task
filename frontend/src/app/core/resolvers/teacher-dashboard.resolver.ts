import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TeacherDashboardService } from '@app/module/teacher-dashboard/services/teacher-dashboard-service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardResolver implements Resolve<any> {

  constructor(private teacherService: TeacherDashboardService) {}

  resolve(): Observable<any> {
    return this.teacherService.getDashboardData().pipe(
      catchError((error) => {
        return of({ stats: null, profile: null });
      })
    );
  }
}
