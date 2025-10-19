import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'], 
   standalone: true,
})
export class Dashboard implements OnInit {
  totalStudents: number = 0;
  presentStudents: number = 0;
  absentStudents: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
  let data = this.route.snapshot.data['dashboardData'];
   this.totalStudents = data?.data?.totalStudents
   this.presentStudents = data?.data?.stats?.present
   this.absentStudents = data?.data?.stats?.absent
  }
}
