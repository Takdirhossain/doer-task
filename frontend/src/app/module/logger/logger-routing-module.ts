import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Logger } from './components/logger/logger';

const routes: Routes = [
  {
    path: '',
    component: Logger,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggerRoutingModule { }
