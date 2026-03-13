import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Team } from './team/team';

const routes: Routes = [
  { path: '',           component: Home },
  { path: 'about',           component: About },
  { path: 'team',           component: Team },
  { path: 'contact',           component: Contact },
  { path: '',                redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }