import { LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { WINDOW_PROVIDERS } from './window.service';
import { ApiInterceptor } from './api.interceptor';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { DateInterceptor } from './date.interceptor';
import { FormatErrorInterceptor } from './error/format-error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { ErrorComponent } from './error/error.component';
import { SharedModule } from '../shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { AuthErrorInterceptor } from '../auth/auth-error.interceptor';
import { FormBuilder } from '@ng-stack/forms';

const withInterceptors = (...interceptors: any[]): Provider[] =>
  interceptors.map(useClass => ({
    provide: HTTP_INTERCEPTORS,
    useClass,
    multi: true,
  }));

@NgModule({
  declarations: [ErrorComponent],
  exports: [ErrorComponent],
  imports: [SharedModule, MatListModule],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: LOCALE_ID,
          useValue: 'pt-BR',
        },
        ...WINDOW_PROVIDERS,
        ...withInterceptors(
          ApiInterceptor,
          LoadingInterceptor,
          DateInterceptor,
          FormatErrorInterceptor,
          AuthErrorInterceptor
        ),
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            duration: 5000,
          } as MatSnackBarConfig,
        },
        {
          provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
          useValue: {
            appearance: 'outline',
          } as MatFormFieldDefaultOptions,
        },
        {
          provide: FormBuilder,
          useFactory: () => new FormBuilder(),
        },
      ],
    };
  }
}
