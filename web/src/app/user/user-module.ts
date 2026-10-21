import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing-module';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Team } from './team/team';
import { Blogs } from './blogs/blogs';
import { AuthComponent } from './auth/auth.component';
import { ToursComponent } from './tours/tours.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

@NgModule({
  imports: [
    Home,
    About,
    Team,
    Blogs,
    AuthComponent,
    ToursComponent,
    TourDetailComponent,
    CheckoutComponent,
    MyBookingsComponent,
    Contact,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
