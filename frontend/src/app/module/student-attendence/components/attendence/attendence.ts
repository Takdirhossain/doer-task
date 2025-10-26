import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { StudentAttendenceService } from '../../service/student-attendence-service';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Attendance, AttendanceResponse } from '../../model/attendence-history.model';
import { CommonModule, DatePipe } from '@angular/common';
import { TableConfig } from '@app/shared/model/common.model';
import { DataTableComponent } from '@app/shared/components/data-table-component/data-table-component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendence',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, DataTableComponent],
  templateUrl: './attendence.html',
  styleUrls: ['./attendence.css'],
})
export class Attendence implements OnInit {
  isMarking: boolean = false;
  attendances: Attendance[] = [];
  loading = false;
  tableConfig: TableConfig = {
      columns: [
        {
          key: 'date',
          label: 'Date',
          class: 'w-16 text-center',
           format: (value) => this.datePipe.transform(value, 'dd/MM/yyyy') || '' 
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'markedAt',
          label: 'Marked At',
          format: (value) => this.datePipe.transform(value, 'dd/MM/yyyy HH:mm') || '' 
        },
        {
          key: 'teacher',
          label: 'Teacher',
          class: 'w-20',
          format: (value, row) => row.teacher.username,
        }
      ],
      showActions: false,
    };

  pagination = {
    page: 1,
    limit: 10,
    total: 0,
  };
  pageSizeOptions = [5, 10, 25, 50];

  constructor(private studentAttendenceService: StudentAttendenceService, private datePipe: DatePipe, private toaster: ToastrService) {}

 ngOnInit(): void {
  this.getAttendenceHistory();
}

  markAttendance() {
    this.isMarking = true;

    this.studentAttendenceService.markAttendance().subscribe({
      next: (res) => {
        this.toaster.success('Attendance marked successfully!');
        this.getAttendenceHistory();
      },
      error: (err) => {
         this.isMarking = false;
        this.toaster.error('Error marking attendance', err?.error?.message || 'Please try again later.');
      },
      complete: () => {
        this.isMarking = false;
      },
    });
  }

  getAttendenceHistory(page: number = this.pagination.page, limit: number = this.pagination.limit) {
   this.loading = true;
    this.studentAttendenceService.getAttendenceHistory({ page, limit }).subscribe({
      next: (res: AttendanceResponse) => {
        let data = res.data;
        this.attendances = data.data;
        this.pagination.total = data.pagination?.totalPages ;
        this.pagination.page = data.pagination?.page || page;
        this.pagination.limit = data.pagination?.limit || limit;
      },
      error: (err) => {
        console.error('Error getting attendance history:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onPageSizeChange(pageSize: number): void {
    this.pagination.limit = pageSize;
    this.pagination.page = 1;
    this.getAttendenceHistory();
  }

onPageChange(event: PageEvent): void {
  const pageNumber = event.pageIndex + 1;
  this.pagination.page = pageNumber;
  this.pagination.limit = event.pageSize;
  this.getAttendenceHistory();
}
}
