import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing-module';
import { Dashboard } from './components/dashboard/dashboard';

@NgModule({
  declarations: [], 
  imports: [
    CommonModule,
    TeacherDashboardRoutingModule,
    Dashboard
  ]
})
export class TeacherDashboardModule {}
