import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogLog } from './components/log-log/log-log';

const routes: Routes = [
  {
    path: '',
    component: LogLog
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginLogRoutingModule { }
