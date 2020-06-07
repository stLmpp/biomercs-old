import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ValidationErrors, AsyncValidatorFn } from '@ng-stack/forms';
import { Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { mapToError } from './util';
import { Directive, forwardRef } from '@angular/core';
import { UserService } from '../state/user/user.service';

export interface UniqueEmailValidator {
  uniqueEmail: boolean;
}

@Directive({
  selector: '[formControl][uniqueEmail], [formControlName][uniqueEmail], [ngModel][uniqueEmail]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueEmailDirective),
      multi: true,
    },
  ],
})
export class UniqueEmailDirective implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl
  ):
    | Promise<ValidationErrors<UniqueEmailValidator> | null>
    | Observable<ValidationErrors<UniqueEmailValidator> | null> {
    return uniqueEmailValidator(this.userService)(control);
  }
}

export const uniqueEmailValidator = (
  userService: UserService,
  idUser?: number
): AsyncValidatorFn<UniqueEmailValidator> => ({ value, pristine }) => {
  if (!value || pristine) return of(null);
  return timer(400).pipe(
    distinctUntilChanged(),
    switchMap(() => {
      return userService.existsByEmail(value, idUser).pipe(mapToError('uniqueEmail'));
    })
  );
};
