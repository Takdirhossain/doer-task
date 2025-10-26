import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { markFormAsTouched } from '@app/core/utils/form.helper';
import { SignUpValidationPatterns } from '@app/shared/validation/validation';
import { AuthService } from '../../services/AuthService';
import { SignUpModel } from '../../models/login.model';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';
import Swal from 'sweetalert2';
import { Role } from '@app/shared/model/roles.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ButtonLoading],
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  error: string = '';
  loading: boolean = false;
  roles: Role[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.setupForm();
    const roles = this.route.snapshot.data['roles'];
    this.roles = roles.data;
    const teacherRole = this.roles.find((r) => r.name === 'TEACHER');
    if (teacherRole) {
      this.signupForm.patchValue({ role: teacherRole.id });
    }
  }

  showToast() {
    console.log('showToast');
    this.toastr.success('Your settings were saved!', 'Success');
  }

  setupForm() {
    this.signupForm = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.username),
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.email),
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(SignUpValidationPatterns.mobile),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      role: [{ value: '', disabled: true }],
    });
  }

  get fc() {
    return this.signupForm.controls;
  }

  submit() {
    this.error = '';
    markFormAsTouched(this.signupForm);
    const payload = this.signupForm.getRawValue();

    if (this.signupForm.valid) {
      this.loading = true;
      this.authService.signup(payload as SignUpModel).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success(response.message, 'Success');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          if (response.data.user.role == 'TEACHER') {
            this.router.navigate(['/teacher/dashboard']);
          } else {
            this.router.navigate(['/student/dashboard']);
          }
        },
        error: (err: any) => {
          this.error = err;
          this.loading = false;
          this.toastr.error(err, 'Error');
        },
      });
    } else {
      this.loading = false;
    }
  }
}
