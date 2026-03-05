import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing-module';
import { Home } from './home/home';
import { About } from './about/about';

@NgModule({
  imports: [
    Home,
    About,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }