import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { StudentAttendenceService } from '../../service/student-attendence-service';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Attendance } from '../../model/attendence-history.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-attendence',
  imports: [MatTableModule, MatPaginatorModule, DatePipe, CommonModule],
  templateUrl: './attendence.html',
  styleUrls: ['./attendence.css'],
})
export class Attendence implements AfterViewInit {
  isMarking: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['date', 'status', 'markedAt', 'teacher'];
  dataSource = new MatTableDataSource<Attendance>([]);

  pagination = {
    page: 1,
    limit: 10,
    total: 0,
  };
  pageSizeOptions = [5, 10, 25, 50];

  constructor(private studentAttendenceService: StudentAttendenceService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getAttendenceHistory();
  }

  markAttendance() {
    this.isMarking = true;

    this.studentAttendenceService.markAttendance().subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Attendance marked successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
        this.getAttendenceHistory();
      },
      error: (err) => {
         this.isMarking = false;
        console.error('Error marking attendance:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to mark attendance',
          text: err?.error?.message || 'Please try again later.',
        });
      },
      complete: () => {
        this.isMarking = false;
      },
    });
  }

  getAttendenceHistory(page: number = 1, limit: number = 10) {
    this.studentAttendenceService.getAttendenceHistory({ page, limit }).subscribe({
      next: (res: any) => {

        this.dataSource.data = res.data.data; 
        this.pagination.total = res.data.pagination?.totalPages ;
        this.pagination.page = res.data.pagination?.page || page;
        this.pagination.limit = res.data.pagination?.limit || limit;
      },
      error: (err) => {
        console.error('Error getting attendance history:', err);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.getAttendenceHistory(event.pageIndex + 1, event.pageSize);
  }
}
