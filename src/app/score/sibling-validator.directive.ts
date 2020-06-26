import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { DefaultPipeType } from '@stlmpp/utils';
import { isNil } from '../util/util';

@Directive({
  selector: '[formControl][sibling], [formControlName][sibling], [ngModel][sibling]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SiblingValidatorDirective),
      multi: true,
    },
  ],
})
export class SiblingValidatorDirective implements Validator {
  @Input() sibling: string;
  @Input() siblingCheckType: DefaultPipeType = 'loose';

  validate(control: AbstractControl): ValidationErrors | null {
    return siblingRequiredValidator(this.sibling, this.siblingCheckType)(control);
  }
}

export const siblingRequiredValidator = (
  sibling: string,
  checkType: DefaultPipeType = 'loose'
): ValidatorFn => {
  return control => {
    const { parent, value, touched, dirty } = control;
    const isEmpty = checkType === 'loose' ? v => !v : isNil;
    if (!parent?.controls?.[sibling]) {
      return null;
    }
    const siblingControl = parent.get(sibling);
    if (isEmpty(value) && isEmpty(siblingControl.value) && dirty) {
      if (siblingControl.hasError('siblingRequired')) {
        siblingControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
      return null;
    }
    if (!isEmpty(value) && isEmpty(siblingControl.value)) {
      siblingControl.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    }
    if (!isEmpty(siblingControl.value) && isEmpty(value)) {
      if (!touched) {
        control.markAsTouched();
      }
      return { siblingRequired: true };
    }
    return null;
  };
};
