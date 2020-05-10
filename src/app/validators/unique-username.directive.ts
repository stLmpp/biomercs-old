import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../auth/state/auth.service';
import { Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { mapToError } from './util';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  selector:
    '[formControl][uniqueUsername], [formControlName][uniqueUsername], [ngModel][uniqueUsername]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueUsernameDirective),
      multi: true,
    },
  ],
})
export class UniqueUsernameDirective implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniqueUsernameValidator(this.authService)(control);
  }
}

export const uniqueUsernameValidator = (
  authService: AuthService
): AsyncValidatorFn => ({ value, pristine }) => {
  if (!value || pristine) return of(null);
  return timer(400).pipe(
    distinctUntilChanged(),
    switchMap(() => {
      return authService
        .existsByUsername(value)
        .pipe(mapToError('uniqueUsername'));
    })
  );
};
