import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { GetLogsResponse, LogData, LoginLog, Pagination } from '../../model/login-log.model';
import { LoginLogService } from '../../service/login-log-service';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableConfig } from '@app/shared/model/common.model';
import { DataTableComponent } from '@app/shared/components/data-table-component/data-table-component';

@Component({
  selector: 'app-log-log',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    DataTableComponent,
  ],
  templateUrl: './log-log.html',
  styleUrls: ['./log-log.css'],
  providers: [DatePipe],
})
export class LogLog implements OnInit {
  tableConfig: TableConfig = {
    columns: [
      {
        key: 'id',
        label: 'ID',
        class: 'w-16 text-center',
      },
      {
        key: 'ipAddress',
        label: 'IP Address',
      },
      {
        key: 'userAgent',
        label: 'User Agent',
      },
      {
        key: 'message',
        label: 'Message',
        class: 'w-20',
      },
      {
        key: 'actionType',
        label: 'Action Type',
        class: 'w-32',
      },
      {
        key: 'status',
        label: 'Status',
        class: 'w-40',
      },
      {
        key: 'actionTime',
        label: 'Action Time',
        class: 'max-w-xs truncate',
        format: (value, row) => this.datePipe.transform(row.actionTime, 'dd/MM/yyyy h:mm:ss a') || '',
      },
    ],
    showActions: false,
  };
  loginLogs: LoginLog[] = [];

  pagination: Pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  loading = false;
  pageSizeOptions = [10, 20, 30, 40, 50];

  constructor(private loginLogService: LoginLogService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs() {
    this.loading = true;
    this.loginLogService.getLogs(this.pagination).subscribe({
      next: (response: GetLogsResponse) => {
        let data = response.data;
        this.pagination = data.pagination;
        this.loginLogs = data.logs;
      },
      error: (err) =>this.loading = false,
      complete: () => (this.loading = false),
    });
  }

  onPageSizeChange(pageSize: number): void {
    this.pagination.limit = pageSize;
    this.pagination.page = 1;
    this.getLogs();
  }

onPageChange(event: PageEvent): void {
  const pageNumber = event.pageIndex + 1;
  this.pagination.page = pageNumber;
  this.pagination.limit = event.pageSize;
  this.getLogs();
}
}
