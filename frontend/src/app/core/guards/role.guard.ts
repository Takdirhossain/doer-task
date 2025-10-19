import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const user = JSON.parse(userData);
    const userRole = user?.role;
    const requiredRoles: string[] = route.data['requiredRole'] || [];

    if (!userRole || !requiredRoles.includes(userRole)) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
