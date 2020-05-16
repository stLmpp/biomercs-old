import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { NotLoggedGuard } from './not-logged.guard';
import { ForgotPasswordComponent } from './login-register/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login-register/reset-password/reset-password.component';
import { ResetPasswordGuard } from './login-register/reset-password/reset-password.guard';
import { RouteParamEnum } from '../model/route-param.enum';
import { SingleUserResolver } from '../state/user/user.resolver';

const routes: Routes = [
  {
    path: '',
    component: LoginRegisterComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotLoggedGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NotLoggedGuard],
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NotLoggedGuard],
      },
      {
        path: `reset-password/:${RouteParamEnum.idUser}`,
        component: ResetPasswordComponent,
        canActivate: [ResetPasswordGuard],
        resolve: [SingleUserResolver],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
