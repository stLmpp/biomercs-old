import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
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
