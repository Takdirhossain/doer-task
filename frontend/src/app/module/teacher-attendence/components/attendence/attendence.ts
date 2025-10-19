import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TeacherAttendenceService } from '../../service/teacher-attendence-service';
import { AttendanceResponse, StudentAttendance } from '../../model/attendence.model';
import { Pagination } from '@app/module/login-log/model/login-log.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-attendence',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatPaginatorModule],
  templateUrl: './attendence.html',
  styleUrl: './attendence.css'
})
export class Attendence implements OnInit {
  displayedColumns: string[] = ['studentId', 'name', 'username', 'status'];
  presentData: StudentAttendance[] = [];
  absentData: StudentAttendance[] = [];
  
  @ViewChild('presentPaginator') presentPaginator!: MatPaginator;
  @ViewChild('absentPaginator') absentPaginator!: MatPaginator;
  
  filter: 'present' | 'absent' = 'present';
  loading = false;
  
  paginationPresent: Pagination = {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };
  
  paginationAbsent: Pagination = {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };

  constructor(private attendanceService: TeacherAttendenceService) {}

  ngOnInit(): void {
    this.getAttendance('present');
    this.getAttendance('absent');
  }

  getAttendance(filter: 'present' | 'absent') {
    this.loading = true;
    const pagination = filter === 'present' ? this.paginationPresent : this.paginationAbsent;
    
    this.attendanceService.getAttendence(filter, pagination.page, pagination.limit).subscribe({
      next: (res: AttendanceResponse) => {
        if (filter === 'present') {
          this.presentData = res.data.data;
          this.paginationPresent.total = res.data.total;
          this.paginationPresent.totalPages = res.data.totalPages;
          this.paginationPresent.page = res.data.page;
          this.paginationPresent.limit = res.data.limit;
        } else {
          this.absentData = res.data.data;
          this.paginationAbsent.total = res.data.total;
          this.paginationAbsent.totalPages = res.data.totalPages;
          this.paginationAbsent.page = res.data.page;
          this.paginationAbsent.limit = res.data.limit;
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onTabChange(filter: 'present' | 'absent') {
    this.filter = filter;
    this.getAttendance(filter);
  }

  onPageChange(event: PageEvent, filter: 'present' | 'absent') {
    const pageNumber = event.pageIndex + 1;
    const pagination = filter === 'present' ? this.paginationPresent : this.paginationAbsent;
    
    pagination.page = pageNumber;
    pagination.limit = event.pageSize;
    
    this.getAttendance(filter);
  }
}