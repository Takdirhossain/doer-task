import { Component, Input } from '@angular/core';
import { StudentList } from '../../models/student-list.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { StudentManagementService } from '../../services/student-management-service';
import { SignUpValidationPatterns } from '@app/shared/validation/validation';
import { markFormAsTouched } from '@app/core/utils/form.helper';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-edit-student',
  imports: [MatDialogContent, MatIcon, ButtonLoading, ReactiveFormsModule, CommonModule, MatSlideToggleModule],
  templateUrl: './edit-student.html',
  styleUrl: './edit-student.css',
})
export class EditStudent {
  @Input() studentData!: StudentList ;
   editStudentForm!: FormGroup;
  loading = false;
  error?: string;
 constructor(
    private dialogRef: MatDialogRef<EditStudent>,
    private formBuilder: FormBuilder,
    private studentService: StudentManagementService
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.editStudentForm = this.formBuilder.group({
      rollNumber: new FormControl(this.studentData.rollNumber, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
      ]),
      firstName: new FormControl(this.studentData.firstName, [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl(this.studentData.lastName, [
        Validators.required,
        Validators.minLength(2),
      ]),
      address: new FormControl(this.studentData.address, [
        Validators.required,
        Validators.minLength(5),
      ]),
      username: new FormControl(this.studentData.user.username, [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.username),
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl(this.studentData.user.email, [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.email),
      ]),
      mobile: new FormControl(this.studentData.user.mobileNumber, [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.mobile),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
     status: new FormControl(this.studentData.user.status == 'ACTIVE' ? true : false)
    });
  }

  get fc() {
    return this.editStudentForm.controls;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    markFormAsTouched(this.editStudentForm);
    if (this.editStudentForm.valid) {
      this.loading = true;
      const payload = {
        ...this.editStudentForm.value,
        userId: this.studentData.userId,
        id: this.studentData.id,
      };
      console.log(payload);

      // this.studentService.updateStudent(payload).subscribe({
      //   next: (response: any) => {
      //     this.loading = false;
      //     if (response.success) {
      //       this.dialogRef.close({ success: true, data: payload });
      //     }
      //   },
      //   error: (err) => {
      //     this.loading = false;
      //     console.error('Error updating student:', err);
      //     this.error = 'Failed to update student.';
      //   },
      // });
    }
  }
}