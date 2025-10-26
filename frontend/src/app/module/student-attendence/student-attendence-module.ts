import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { StudentAttendenceRoutingModule } from './student-attendence-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentAttendenceRoutingModule
  ],  
  providers: [DatePipe]
})
export class StudentAttendenceModule { }
