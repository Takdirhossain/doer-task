import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '@app/module/auth/models/login.model';

@Component({
  selector: 'app-back-office-sidebar',
  imports: [MatIconModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './back-office-sidebar.html',
  styleUrl: './back-office-sidebar.css',
})
export class BackOfficeSidebar implements OnInit {
  userData : User = {
    id: '',
    username: '',
    email: '',
    mobileNumber: '',
    role: '',
    status: '',
    createdAt: '',
    updatedAt: '',
  }
  

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }
}
