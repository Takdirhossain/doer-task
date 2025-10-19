import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile-service';
import { ProfileResponse } from '../../model/profile.model';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  userId: string = "";
  profile: ProfileResponse | null = null;
  editMode: boolean = false;
  validationError ={
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    address: ''
  }

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    address: ''
  };

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    this.userId = user.id;
    this.getUserProfile();
  }

  getUserProfile() {
    this.profileService.getUserProfile(this.userId).subscribe(res => {
      this.profile = res;

      this.formData.firstName = this.profile?.data?.firstName || '';
      this.formData.lastName = this.profile?.data?.lastName || '';
      this.formData.email = this.profile?.data?.user?.email || '';
      this.formData.mobileNumber = this.profile?.data?.user?.mobileNumber || '';
      this.formData.address = this.profile?.data?.address || '';
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    this.validationError.firstName = this.formData.firstName ? '' : 'First name is required';
    this.validationError.lastName = this.formData.lastName ? '' : 'Last name is required';
    this.validationError.email = this.formData.email ? '' : 'Email is required';
    this.validationError.mobileNumber = this.formData.mobileNumber ? '' : 'Mobile number is required';
    this.validationError.address = this.formData.address ? '' : 'Address is required';
    if(this.validationError.firstName || this.validationError.lastName || this.validationError.email || this.validationError.mobileNumber || this.validationError.address){
      return;
    }
    
    this.profileService.updateUserProfile(this.userId, this.formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Profile updated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        this.editMode = false;
        this.getUserProfile(); 
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update profile',
          text: err?.error?.message || 'Please try again later.'
        });
      }
    });
  }
}
