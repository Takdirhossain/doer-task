import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TableAction, TableColumn, TableConfig } from '@app/shared/model/common.model';
import {  Subject } from 'rxjs';

@Component({
  selector: 'app-data-table-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './data-table-component.html',
  styleUrls: ['./data-table-component.css']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() loading = false;
  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  @Input() noDataMessage = 'No data found.';
  @Input() showSearch = true;
  @Input() showLimit = true;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  searchTerm = '';
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.setupTable();
    console.log(this.data);
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  private setupTable(): void {
    if (this.config && this.config.columns) {
      this.displayedColumns = this.config.columns.map(col => col.key);
      if (this.config.showActions && this.config.actions) {
        this.displayedColumns.push('actions');
      }
    }
    this.dataSource.data = this.data;
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
    this.searchChange.emit(value.trim());
  }

  onPageSizeChange(value: number): void {
    this.pageSizeChange.emit(value);
  }

  getCellValue(row: any, column: TableColumn): string {
    const value = this.getNestedValue(row, column.key);
    return column.format ? column.format(value, row) : (value ?? '-');
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  shouldShowAction(action: TableAction, row: any): boolean {
    return action.condition ? action.condition(row) : true;
  }

  executeAction(action: TableAction, row: any, event: Event): void {
    event.stopPropagation();
    action.callback(row);
  }
}
