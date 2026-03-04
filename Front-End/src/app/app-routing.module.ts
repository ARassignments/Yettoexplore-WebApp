import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

export const routes: Routes = [

  // ── USER / AUTH ROUTES ──────────────────────────────
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/user-routing-module')
            .then(m => m.UserRoutingModule)
      }
    ]
  },

  // ── DASHBOARD ROUTES ────────────────────────────────
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard-routing-module')
            .then(m => m.DashboardRoutingModule)
      }
    ]
  },

  // ── DEFAULT REDIRECTS ───────────────────────────────
  { path: '',   redirectTo: '/user/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/user/home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // ← Register routes
  exports: [RouterModule]                   // ← Export RouterModule
})
export class AppRoutingModule { }           // ← This is what app.module.ts imports