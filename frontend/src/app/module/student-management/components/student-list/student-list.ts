import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { StudentManagementService } from '../../services/student-management-service';
import { StudentListResponse, StudentList } from '../../models/student-list.model';
import { Pagination } from '@app/module/login-log/model/login-log.model';
import { AddStudent } from '../add-student/add-student';
import { DataTableComponent } from '@app/shared/components/data-table-component/data-table-component';
import { TableConfig } from '@app/shared/model/common.model';
import { EditStudent } from '../edit-student/edit-student';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    DataTableComponent
  ],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.css']
})
export class StudentListComponent implements OnInit {
  students: StudentList[] = [];
  loading = false;
  searchTerm = '';
  
  pagination: Pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  tableConfig: TableConfig = {
    columns: [
      {
        key: 'rollNumber',
        label: 'Roll No',
        class: 'w-16 text-center'
      },
      {
        key: 'name',
        label: 'Name',
        format: (value, row) => `${row.firstName} ${row.lastName}`
      },
      {
        key: 'user.username',
        label: 'Username'
      },
      {
        key: 'class',
        label: 'Class',
        class: 'w-20'
      },
      {
        key: 'user.mobileNumber',
        label: 'Mobile',
        class: 'w-32'
      },
      {
        key: 'user.email',
        label: 'Email',
        class: 'w-40'
      },
      {
        key: 'address',
        label: 'Address',
        class: 'max-w-xs truncate'
      }
    ],
    actions: [
      {
        icon: 'edit',
        tooltip: 'Edit Student',
        color: 'primary',
        callback: (row) => this.editStudent(row)
      },
      {
        icon: 'delete',
        tooltip: 'Delete Student',
        color: 'warn',
        callback: (row) => this.deleteStudent(row),
        condition: (row) => row.status !== 'archived' 
      }
    ],
    showActions: true
  };

  private searchSubject = new Subject<string>();

  constructor(
    private studentManagementService: StudentManagementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getStudents(1, this.pagination.limit, '');

    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        this.getStudents(1, this.pagination.limit, term);
      });
  }

  getStudents(page: number, limit: number, searchTerm: string = ''): void {
    this.loading = true;
    this.pagination.page = page;
    this.pagination.limit = limit;

    this.studentManagementService.getStudents(page, limit, searchTerm).subscribe({
      next: (response: StudentListResponse) => {
        if (response.success) {
          const data = response.data;
          this.students = data.students;
          this.pagination.total = data.total;
          this.pagination.totalPages = data.pages;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.loading = false;
      }
    });
  }

  onPageSizeChange(pageSize: number): void {
    this.pagination.limit = pageSize;
    this.pagination.page = 1;
    this.getStudents(1, pageSize, this.searchTerm);
  }

onPageChange(event: PageEvent): void {
  console.log(event);
  const pageNumber = event.pageIndex + 1;
  this.pagination.page = pageNumber;
  this.pagination.limit = event.pageSize;
  this.getStudents(pageNumber, event.pageSize, this.searchTerm || '');
}

  onSearchChange(value: string): void {
    this.searchSubject.next(value.trim());
  }

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudent, {
      width: '600px',
      data: { title: 'Add Student' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStudents(1, this.pagination.limit);
      }
    });
  }

editStudent(student: StudentList): void {
  const dialogRef = this.dialog.open(EditStudent, {
    width: '600px',
  });

  dialogRef.componentInstance.studentData = student;

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.getStudents(1, this.pagination.limit);
    }
  });
}

  deleteStudent(student: StudentList): void {
    console.log('Delete student:', student);
   Swal.fire({
    title: 'Are you sure?',
    text: `You Want to delete ${student.firstName} ${student.lastName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.studentManagementService.deleteStudent(student?.userId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.getStudents(1, this.pagination.limit);
            Swal.fire(
              'Deleted!',
              `${student.firstName} ${student.lastName} has been deleted.`,
              'success'
            );
          }
        },
        error: (error) => {
          Swal.fire(
            'Error!',
            error.error.message,
            'error'
          );
        }
      });

    }
  });
  }
}