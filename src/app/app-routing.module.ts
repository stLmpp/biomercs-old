import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { DefaultResolver } from './state/default/default.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    resolve: [DefaultResolver],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    resolve: [DefaultResolver],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard],
    resolve: [DefaultResolver],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canLoad: [AuthGuard],
    resolve: [DefaultResolver],
  },
  {
    path: 'score',
    loadChildren: () => import('./score/score.module').then(m => m.ScoreModule),
    canLoad: [AuthGuard],
    resolve: [DefaultResolver],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'corrected',
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
