import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { markFormAsTouched } from '@app/core/utils/form.helper';
import { CommonModule } from '@angular/common';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';
import { StudentManagementService } from '../../services/student-management-service';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonLoading
  ],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent implements OnInit {
  addStudentForm!: FormGroup;
  loading = false;
  error?: string;
  constructor(private dialogRef: MatDialogRef<AddStudent>, private formBuilder: FormBuilder,private addStudentService: StudentManagementService) {
  }
    ngOnInit() {
    this.setupForm();
  }
    setupForm() {
    this.addStudentForm = this.formBuilder.group({
      rollNumber: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(11)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get fc() {
    return this.addStudentForm.controls;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
  console.log("first")
   markFormAsTouched(this.addStudentForm);
    if (this.addStudentForm.valid) {
      console.log("second")
      this.addStudentService.addStudent(this.addStudentForm.value).subscribe({
        next: (response: any) => {
          if (response.success) {
            // this.dialogRef.close({ success: true, data: this.addStudentForm.value });
          }
        },
        error: (error) => {
          console.error('Error adding student:', error);
          this.error = 'Failed to add student.';
        }
      });
    }
  }
}
