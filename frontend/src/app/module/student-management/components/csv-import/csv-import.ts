import { Component } from '@angular/core';
import { StudentManagementService } from '../../services/student-management-service';
import Swal from 'sweetalert2';
import { Student, StudentResponse } from '../../models/student-management.model';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';
import { TableConfig } from '@app/shared/model/common.model';
import { DataTableComponent } from '@app/shared/components/data-table-component/data-table-component';
import { Pagination } from '@app/module/login-log/model/login-log.model';

@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.html',
  styleUrls: ['./csv-import.css'],
  imports: [MatTabsModule, MatTableModule, CommonModule, RouterLink, ButtonLoading, DataTableComponent],
})
export class CsvImport {
  loading: boolean = false;
  loadingSave: boolean = false;
  file: File | null = null;

  tableConfig: TableConfig = {
        columns: [
          {
            key: 'rollNumber',
            label: 'Roll Number'  ,
            class: 'w-16 text-center',
          },
          {
            key: 'className',
            label: 'Class Name',
          },
          {
            key: 'firstName',
            label: 'First Name',
          },
          {
            key: 'lastName',
            label: 'Last Name',
          },
          {
            key: 'email',
            label: 'Email',
          },
          {
            key: 'mobileNumber',
            label: 'Mobile Number',
          },
          {
            key:'reason',
            label:'Reason',
          }
          
        ],
        showActions: false,
      };

  uniqueUsers: Student[] = [];
  duplicateUsers: Student[] = [];
  uniqueCount: number = 0;
  duplicateCount: number = 0;
  activePage: 'unique' | 'duplicate' = 'unique';
  pagination: Pagination= {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  constructor(private StudentManagementService: StudentManagementService) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0] || null;

    if (selectedFile && selectedFile.type !== 'text/csv') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid file type',
        text: 'Please select a valid CSV file',
      });
      this.file = null;
      return;
    }

    this.file = selectedFile;
  }

  processFile() {
    if (!this.file) {
      Swal.fire({
        icon: 'error',
        title: 'Select a file',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.loading = true;
    this.StudentManagementService.uploadCsv(formData).subscribe({
      next: (res: any) => {
        let data = res?.data
        this.uniqueUsers = data?.uniqueUsers || [];
        
        this.duplicateUsers = data?.duplicateUsers || [];
        this.uniqueCount = data?.uniqueCount || 0;
        this.duplicateCount = data?.duplicateCount || 0;
        Swal.fire({
          icon: 'success',
          title: 'Upload success',
          text: 'File uploaded successfully',
        });
        this.loading = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload error',
          text: 'File upload failed',
        });
        this.loading = false;
      },
    });
  }
  save() {
    if(!this.uniqueCount){
      Swal.fire({
        icon: 'error',
        title: 'No unique users found',
      });
      return;
    }
    this.loadingSave = true;
    this.StudentManagementService.saveCsv().subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Save success',
          text: 'File saved successfully',
        });
        this.loadingSave = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Save error',
          text: 'File save failed',
        });
        this.loadingSave = false;
      },
    });
  }

}
