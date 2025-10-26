import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../service/dashboard-service';
import { AttendanceDataWrapper } from '../../model/dashboard.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboard: AttendanceDataWrapper = {} as AttendanceDataWrapper;
  constructor(private dashboardService: DashboardService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboard = res.data;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
}
