import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list';
import { CsvImport } from './components/csv-import/csv-import';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: StudentListComponent
  },
  {
    path: 'csv-import',
    component: CsvImport
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MatDialogModule],
  exports: [RouterModule]
})
export class StudentManagementRoutingModule { }
