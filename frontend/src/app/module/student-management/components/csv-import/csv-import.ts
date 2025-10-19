import { Component } from '@angular/core';
import { StudentManagementService } from '../../services/student-management-service';
import Swal from 'sweetalert2';
import { Student, StudentResponse } from '../../models/student-management.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';

@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.html',
  styleUrls: ['./csv-import.css'],
  imports: [MatTabsModule, MatTableModule, CommonModule, RouterLink, ButtonLoading],
})
export class CsvImport {
  loading: boolean = false;
  loadingSave: boolean = false;
  file: File | null = null;
  displayedColumns: string[] = [
    'rollNumber',
    'username',
    'firstName',
    'lastName',
    'email',
    'mobileNumber',
    'className',
  ];

  uniqueUsers: Student[] = [];
  duplicateUsers: Student[] = [];
  uniqueCount: number = 0;
  duplicateCount: number = 0;

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
      next: (res) => {
        this.uniqueUsers = res.uniqueUsers || [];
        this.duplicateUsers = res.duplicateUsers || [];
        this.uniqueCount = res.uniqueCount || 0;
        this.duplicateCount = res.duplicateCount || 0;
        console.log(this.uniqueUsers);
        console.log(this.duplicateUsers);
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
