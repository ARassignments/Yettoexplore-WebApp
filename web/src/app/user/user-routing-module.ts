import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { authGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: Home, title: 'Yettoexplore - Discover Hidden Destinations' },
  { path: 'about', component: About, title: 'About Us - Yettoexplore' },
  { path: 'team', component: Team, title: 'Our Team - Yettoexplore' },
  { path: 'blogs', component: Blogs, title: 'Travel Blogs & Stories - Yettoexplore' },
  { path: 'tours', component: ToursComponent, title: 'Explore Tour Packages - Yettoexplore' },
  { path: 'tours/:slug', component: TourDetailComponent, title: 'Tour Itinerary & Booking - Yettoexplore' },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], title: 'Secure Checkout - Yettoexplore' },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard], title: 'My Bookings - Yettoexplore' },
  { path: 'auth', component: AuthComponent, title: 'Sign In / Register - Yettoexplore' },
  { path: 'login', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'contact', component: Contact, title: 'Contact Us - Yettoexplore' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
