import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TeacherAttendenceService } from '../../service/teacher-attendence-service';
import { AttendanceResponse, StudentAttendance } from '../../model/attendence.model';
import { Pagination } from '@app/module/login-log/model/login-log.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableConfig } from '@app/shared/model/common.model';
import { DataTableComponent } from '@app/shared/components/data-table-component/data-table-component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendence',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './attendence.html',
  styleUrl: './attendence.css'
})
export class Attendence implements OnInit {
  tableConfig: TableConfig = {
      columns: [
        {
          key: 'studentId',
          label: 'Student ID',
          class: 'w-16 text-center',
        },
        {
          key: 'name',
          label: 'Name',
        },
        {
          key: 'username',
          label: 'Username',
        },
        {
          key: 'status',
          label: 'Status',
          class: 'w-20',
        }
      ],
      showActions: false,
    };
  data: StudentAttendance[] = [];
  activePage: 'present' | 'absent' = 'present';

  
  loading = false;
  
  pagination: Pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  constructor(private attendanceService: TeacherAttendenceService, private toaster: ToastrService) {}

  ngOnInit(): void {
    this.getAttendance('present', this.pagination.page, this.pagination.limit);
  }

  getAttendance(filter: 'present' | 'absent' = this.activePage, page = this.pagination.page, limit = this.pagination.limit) {
    this.loading = true;
    
    this.attendanceService.getAttendence(filter, page, limit).subscribe({
      next: (res: AttendanceResponse) => {
        let data = res.data;
        this.data = data?.data;
        this.pagination.total = res.data.total;
        this.pagination.totalPages = res.data.totalPages;
        this.pagination.page = res.data.page;
        this.pagination.limit = res.data.limit;
        this.loading = false;
      },
     
      error: (err) => {
        this.loading = false;
        this.toaster.error('Error getting attendance history', err?.error?.message || 'Please try again later.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

onTabChange(index: MatTabChangeEvent) {
  this.activePage = index.index == 0 ? 'present' : 'absent';
  this.getAttendance(this.activePage);
}

  onPageChange(event: PageEvent) {
    console.log(event);
    const pageNumber = event.pageIndex + 1;
    console.log(pageNumber);
    this.getAttendance(this.activePage, pageNumber);

 
  }
    onPageSizeChange(pageSize: number): void {
    this.pagination.limit = pageSize;
    this.pagination.page = 1;
    this.getAttendance(this.activePage, this.pagination.page, this.pagination.limit);
  }
}