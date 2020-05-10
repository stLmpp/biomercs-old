import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { NotLoggedGuard } from './not-logged.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginRegisterComponent,
    canActivate: [NotLoggedGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
