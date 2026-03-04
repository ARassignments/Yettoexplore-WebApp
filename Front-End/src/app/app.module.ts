import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';      // ← Now works ✅
import { AppComponent } from './app.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    AppRoutingModule,             // ← Finds AppRoutingModule now ✅
    DashboardLayoutComponent,
    UserLayoutComponent
  ],
})
export class AppModule { }