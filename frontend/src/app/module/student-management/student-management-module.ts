import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentManagementRoutingModule } from './student-management-routing-module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentManagementRoutingModule,
    ReactiveFormsModule
  ]
})
export class StudentManagementModule { }
