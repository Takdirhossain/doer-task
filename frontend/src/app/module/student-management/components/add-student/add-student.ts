import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { markFormAsTouched } from '@app/core/utils/form.helper';
import { CommonModule } from '@angular/common';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';
import { StudentManagementService } from '../../services/student-management-service';
import { SignUpValidationPatterns } from '@app/shared/validation/validation';
import { MatIcon } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Role, RolesResponse } from '@app/shared/model/roles.model';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    MatIcon,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonLoading,
  ],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent implements OnInit {
  addStudentForm!: FormGroup;
  loading = false;
  error?: string;
  roles: Role[] = [];
  constructor(
    private dialogRef: MatDialogRef<AddStudent>,
    private formBuilder: FormBuilder,
    private addStudentService: StudentManagementService
  ) {}
  ngOnInit() {
    this.getRoles();
    this.setupForm();
  }
  setupForm() {
    this.addStudentForm = this.formBuilder.group({
      rollNumber: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
      ]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.username),
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      password_hash: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.email),
      ]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.mobile),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      class: new FormControl('', [Validators.required, Validators.min(1), Validators.max(12)]),
      dateOfBirth: new FormControl('', [Validators.required]),
    });
  }
  minimumAgeValidator(minAge: number) {
    return (control: FormControl) => {
      const dob = new Date(control.value);
      if (isNaN(dob.getTime())) return null;
  
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
  
      const isTooYoung = age < minAge || (age === minAge && m < 0);
      return isTooYoung ? { minAge: true } : null;
    };
  }
  get fc() {
    return this.addStudentForm.controls;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log('first');
    markFormAsTouched(this.addStudentForm);
    if (this.addStudentForm.valid) {
      console.log('second');
      this.addStudentService.addStudent(this.addStudentForm.value).subscribe({
        next: (response: any) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Student added successfully',
              showConfirmButton: false,
              timer: 1500,
            });
            this.dialogRef.close({ success: true, data: this.addStudentForm.value });
          }
        },
        error: (error) => {
          console.error('Error adding student:', error?.error?.message);
          Swal.fire({
            icon: 'error',
            title: error?.error?.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.error = error?.error?.message;
        },
      });
    }
  }
  getRoles() {
    this.addStudentService.getRoles().subscribe({
      next: (response: RolesResponse) => {
        console.log(response);
        this.roles = response.data;
      },
      error: (error) => {
        console.error('Error getting roles:', error?.error?.message);
        Swal.fire({
          icon: 'error',
          title: error?.error?.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.error = error?.error?.message;
      },
    });
  }
}
