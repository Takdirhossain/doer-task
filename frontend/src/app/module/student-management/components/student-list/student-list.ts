import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { StudentManagementService } from '../../services/student-management-service';
import { StudentListResponse, StudentList } from '../../models/student-list.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Pagination } from '@app/module/login-log/model/login-log.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddStudent } from '../add-student/add-student';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent implements OnInit {
  displayedColumns: string[] = ['rollNumber', 'name', 'username', 'class', 'mobileNumber', 'email', 'address'];
  
  dataSource = new MatTableDataSource<StudentList>([]);
  
  pagination: Pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  searchTerm = '';
  loading = false;
  totalStudents = 0;
  private searchSubject = new Subject<string>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private studentManagementService: StudentManagementService, private dialog: MatDialog) {}

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

  getStudents(page: number, limit: number, searchTerm?: string): void {
    this.loading = true;
    this.pagination.page = page;
    this.pagination.limit = limit;

    this.studentManagementService.getStudents(page, limit, searchTerm).subscribe({
      next: (response: StudentListResponse) => {
        if (response.success) {
          const data = response.data;
          this.dataSource.data = data.students;
          this.totalStudents = data.total;
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
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.getStudents(1, pageSize);
  }

  onPageChange(event: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    this.pagination.page = pageNumber;
    this.pagination.limit = event.pageSize;
    this.getStudents(pageNumber, event.pageSize);
  }

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudent, {
      width: '400px',
      data: { title: 'Add Student' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStudents(1, this.pagination.limit);
      }
    });
  }
   onSearchChange(value: string): void {
    this.searchSubject.next(value.trim());
  }
}