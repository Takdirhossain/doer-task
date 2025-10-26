import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { LoginResponse } from '../../models/login.model';
import Swal from 'sweetalert2';
import { ButtonLoading } from '@app/shared/components/button-loading/button-loading';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterLink,
    ButtonLoading
  ],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private toastr:ToastrService) {}

  ngOnInit() {
    this.setupForm();
  }
  setupForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get fc() {
    return this.loginForm.controls;
  }

  submit() {
    this.error = '';
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response: LoginResponse) => {
          this.loading = false;
        this.toastr.success(response.message, 'Success');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          if(response.data.user.role == 'TEACHER'){
            this.router.navigate(['/teacher/dashboard']);
          }else{
            this.router.navigate(['/student/dashboard']);
          }
        },
        error: (err: any) => {
          console.log(err);
          this.error = err;
          this.loading = false;
          this.toastr.error(err, 'Error');
        },
      });
    } else {
      console.log('Form Invalid');
    }
  }
}
