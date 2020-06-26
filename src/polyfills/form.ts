import { FormGroup } from '@ng-stack/forms';
import { ValidatorsModel } from '@ng-stack/forms/lib/types';
import { FormGroup as NativeFormGroup } from '@angular/forms';

declare module '@ng-stack/forms/lib/form-group' {
  interface FormGroup<T extends object = any, V extends object = ValidatorsModel> extends NativeFormGroup {
    getDirtyValues(): T;
  }
}

function _getDirtyValues(form: FormGroup): { [key: string]: any } {
  return Object.entries(form.controls).reduce((acc, [key, value]) => {
    if (value.dirty) {
      if ((value as any)?.controls?.length) {
        acc[key] = this._getDirtyValues(value);
      } else {
        acc[key] = value.value;
      }
    }
    return acc;
  }, {});
}

FormGroup.prototype.getDirtyValues = function(): { [key: string]: any } {
  return _getDirtyValues(this);
};
