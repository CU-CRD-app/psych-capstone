import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'train', canActivate: [AuthGuard], loadChildren: './training/training.module#TrainingPageModule' },
  { path: 'history', canActivate: [AuthGuard], loadChildren: './history/history.module#HistoryPageModule' },
  { path: 'about', canActivate: [AuthGuard], loadChildren: './about-us/about-us.module#AboutUsPageModule' },
  { path: 'settings', canActivate: [AuthGuard], loadChildren: './user-settings/user-settings.module#UserSettingsPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
