import { Directive, forwardRef } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Directive({
  selector: '[formControl][url], [formControlName][url], [ngModel][url]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UrlDirective),
      multi: true,
    },
  ],
})
export class UrlDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return urlValidator(control);
  }
}

export const urlValidator: ValidatorFn = Validators.pattern(
  '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
);
