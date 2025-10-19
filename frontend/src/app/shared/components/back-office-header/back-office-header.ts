import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/module/auth/services/AuthService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-back-office-header',
  imports: [CommonModule],
  templateUrl: './back-office-header.html',
  styleUrl: './back-office-header.css',
})
export class BackOfficeHeader implements OnInit {
  user: any;
  constructor(private authService: AuthService,private router: Router) {}
  ngOnInit(): void {
    let data = localStorage.getItem('user');
    this.user = JSON.parse(data!);
  }
  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'You have been logged out successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
