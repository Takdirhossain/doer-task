import { Routes } from '@angular/router';
import { BackOfficeLayout } from './shared/layout/back-office-layout/back-office-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { TeacherDashboardResolver } from './core/resolvers/teacher-dashboard.resolver';
import { RolesResolver } from './core/resolvers/roles.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./module/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'teacher',
    component: BackOfficeLayout,
    canActivate: [AuthGuard], 
    children: [
      {
        path: '',
        loadChildren: () => import('./module/teacher-dashboard/teacher-dashboard-module').then(m => m.TeacherDashboardModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['TEACHER'] },
         resolve: { dashboardData: TeacherDashboardResolver } 
      },
      {
        path: 'student-management',
        loadChildren: () => import('./module/student-management/student-management-module').then(m => m.StudentManagementModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['TEACHER'] },

      },
      {
        path: 'login-logs',
        loadChildren: () => import('./module/login-log/login-log-module').then(m => m.LoginLogModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['TEACHER'] },
      },
      {
        path: 'attendence',
        loadChildren: () => import('./module/teacher-attendence/teacher-attendence-module').then(m => m.TeacherAttendenceModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['TEACHER'] },
      },
      {
        path: 'logger',
        loadChildren: () => import('./module/logger/logger-module').then(m => m.LoggerModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['TEACHER'] },
      },
    ]
  },{
    path: 'student',
    component: BackOfficeLayout,
    canActivate: [AuthGuard], 
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./module/dashboard/dashboard-module').then(m => m.DashboardModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['STUDENT'] },
      },
      {
        path: 'profile',
        loadChildren: () => import('./module/profile/profile-module').then(m => m.ProfileModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['STUDENT'] },
      },
       {
        path: 'login-logs',
        loadChildren: () => import('./module/login-log/login-log-module').then(m => m.LoginLogModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['STUDENT'] },
      },
      {
        path: 'attendence',
        loadChildren: () => import('./module/student-attendence/student-attendence-module').then(m => m.StudentAttendenceModule),
        canActivate: [RoleGuard], 
        data: { requiredRole: ['STUDENT'] },
      },
    ]
  }
  
];
