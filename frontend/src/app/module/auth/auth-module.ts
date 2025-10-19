import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './components/login/login';
import { SharedModule } from '@app/shared/SharedModule.module';
import { Signup } from './components/signup/signup';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    Login,
    Signup
  ]
})
export class AuthModule { }