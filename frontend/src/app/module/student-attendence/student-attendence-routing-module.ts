import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Attendence } from './components/attendence/attendence';

const routes: Routes = [
  {
    path: '',
    component: Attendence
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAttendenceRoutingModule { }
