import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackOfficeHeader } from '@app/shared/components/back-office-header/back-office-header';
import { BackOfficeSidebar } from '@app/shared/components/back-office-sidebar/back-office-sidebar';

@Component({
  selector: 'app-back-office-layout',
  imports: [RouterOutlet, BackOfficeSidebar, BackOfficeHeader],
  templateUrl: './back-office-layout.html',
  styleUrl: './back-office-layout.css'
})
export class BackOfficeLayout {

}
