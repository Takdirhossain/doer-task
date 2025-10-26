import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RolesResponse } from '@app/shared/model/roles.model';
import { RolesService } from '@app/shared/services/roles.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolesResolver implements Resolve<RolesResponse> {

  constructor(private rolesService: RolesService) {}

  resolve(): Observable<RolesResponse> {
    return this.rolesService.getRoles().pipe(
      catchError((error) => {
        return of({ success: false, message: error, data: [] });
      })
    );
  }
}
