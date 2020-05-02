import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './state/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { MatCardModule } from '@angular/material/card';

const DECLARATIONS = [LoginRegisterComponent];

@NgModule({
  declarations: [...DECLARATIONS, LoginComponent, RegisterComponent],
  exports: [...DECLARATIONS],
  imports: [
    AuthRoutingModule,
    SharedModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (authService: AuthService) => () =>
            authService.autoLogin().toPromise(),
          deps: [AuthService],
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    };
  }
}
