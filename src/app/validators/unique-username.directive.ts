import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import { AsyncValidatorFn, ValidationErrors } from '@ng-stack/forms';
import { Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { mapToError } from './util';
import { Directive, forwardRef } from '@angular/core';
import { UserService } from '../state/user/user.service';

export interface UniqueUsernameValidator {
  uniqueUsername: boolean;
}

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
  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl
  ):
    | Promise<ValidationErrors<UniqueUsernameValidator> | null>
    | Observable<ValidationErrors<UniqueUsernameValidator> | null> {
    return uniqueUsernameValidator(this.userService)(control);
  }
}

export const uniqueUsernameValidator = (
  userService: UserService
): AsyncValidatorFn<UniqueUsernameValidator> => ({ value, pristine }) => {
  if (!value || pristine) return of(null);
  return timer(400).pipe(
    distinctUntilChanged(),
    switchMap(() => {
      return userService
        .existsByUsername(value)
        .pipe(mapToError('uniqueUsername'));
    })
  );
};
