import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing-module';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Team } from './team/team';

@NgModule({
  imports: [
    Home,
    About,
    Team,
    Contact,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }