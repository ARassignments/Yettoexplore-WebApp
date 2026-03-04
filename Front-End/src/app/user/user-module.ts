import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing-module';
import { Home } from './home/home';

@NgModule({
  imports: [
    Home,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }