import { Component } from '@angular/core';
import { Log, LoggerResponse } from '../../model/logger.model';
import { Pagination } from '@app/module/login-log/model/login-log.model';
import { TableConfig } from '@app/shared/model/common.model';
import { LoggerService } from '../../service/logger-service';
import { DatePipe } from '@angular/common';
import { DataTableComponent } from '@app/shared/components/data-table-component/data-table-component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-logger',
  imports: [DataTableComponent],
  templateUrl: './logger.html',
  styleUrl: './logger.css',
  providers: [DatePipe],
})
export class Logger {
  logs: Log[] = [];
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
        key: 'id',
        label: 'ID',
        format: (value, row) => row.id || 'N/A',
      },
      {
        key: 'userName',
        label: 'User Name',
        format: (value, row) => row.userName || 'N/A',
      },
      {
        key: 'level',
        label: 'Level',
        format: (value, row) => row.level || 'N/A',
      },
      {
        key: 'category',
        label: 'Category',
        format: (value, row) => row.category || 'N/A',
      },
      {
        key: 'action',
        label: 'Action',
        format: (value, row) => row.action || 'N/A',
      },
      {
        key: 'ipAddress',
        label: 'IP Address',
        format: (value, row) => row.ipAddress || 'N/A',
      },
      {
        key: 'message',
        label: 'Message',
        format: (value: string) => {
          if (!value) return 'N/A';
          const limit = 50;
          return value.length > limit ? value.substring(0, limit) + '...' : value;
        },
      },
      {
        key: 'method',
        label: 'Method',
        format: (value, row) => row.method || 'N/A',
      },
      {
        key: 'path',
        label: 'Path',
        format: (value, row) => row.path || 'N/A',
      },
      {
        key: 'createdAt',
        label: 'Created At',
        format: (value, row) =>
          this.datePipe.transform(row.createdAt, 'dd/MM/yyyy h:mm:ss a') || 'N/A',
      },
    ],
    showActions: false,
  };
  constructor(private loggerService: LoggerService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs() {
    this.loading = true;
    this.loggerService.getLogger(this.pagination.page, this.pagination.limit).subscribe({
      next: (response: LoggerResponse) => {
        let data = response.data;
        this.logs = data?.logs;
        this.pagination = data?.pagination;
      },
      error: (err) => (this.loading = false),
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
