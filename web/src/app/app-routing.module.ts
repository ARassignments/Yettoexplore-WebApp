import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { userAreaGuard } from './core/guards/user-area.guard';
import { dashboardGuard } from './core/guards/dashboard.guard';

export const routes: Routes = [

  // ── USER / AUTH ROUTES (Restricted: Non-travelers redirected to /dashboard) ──
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [userAreaGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/user-routing-module')
            .then(m => m.UserRoutingModule)
      }
    ]
  },

  // ── DASHBOARD ROUTES (Requires Authentication) ──────────────
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [dashboardGuard],
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
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // ← Register routes
  exports: [RouterModule]                   // ← Export RouterModule
})
export class AppRoutingModule { }           // ← This is what app.module.ts imports