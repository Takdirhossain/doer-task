import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoginLog, Pagination } from '../../model/login-log.model';
import { LoginLogService } from '../../service/login-log-service';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-log-log',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    TitleCasePipe,
    NgClass,
    DatePipe,
  ],
  templateUrl: './log-log.html',
  styleUrls: ['./log-log.css'],
})
export class LogLog implements OnInit {
  displayedColumns: string[] = [
    'id',
    'ipAddress',
    'userAgent',
    'message',
    'actionType',
    'status',
    'actionTime',
  ];
  dataSource = new MatTableDataSource<LoginLog>([]);
  pagination: Pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  loading = false;
  pageSizeOptions = [10, 20, 30, 40, 50];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private loginLogService: LoginLogService) {}

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs() {
    this.loading = true;
    this.loginLogService.getLogs(this.pagination).subscribe({
      next: (response) => {
        this.dataSource.data = response.data.logs;
        this.pagination = response.data.pagination;
      },
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }

  onPageChange(event: PageEvent) {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.getLogs();
  }

  onLimitChange(limit: number) {
    this.pagination.limit = limit;
    this.pagination.page = 1;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.getLogs();
  }
}
