import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'train', canActivate: [AuthGuard], loadChildren: './training/training.module#TrainingPageModule' },
  { path: 'history', canActivate: [AuthGuard], loadChildren: './history/history.module#HistoryPageModule' },
  { path: 'about', canActivate: [AuthGuard], loadChildren: './about-us/about-us.module#AboutUsPageModule' },
  { path: 'settings', canActivate: [AuthGuard], loadChildren: './user-settings/user-settings.module#UserSettingsPageModule' },
  { path: 'leaderboard', canActivate: [AuthGuard], loadChildren: './leaderboard/leaderboard.module#LeaderboardPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: '**', redirectTo: 'login' },
  /*
  {
    path: 'leaderboard',
    loadChildren: () => import('./leaderboard/leaderboard.module').then( m => m.LeaderboardPageModule)
  }
  */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
