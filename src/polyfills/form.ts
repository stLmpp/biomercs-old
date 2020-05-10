import { AbstractControl, FormGroup } from '@angular/forms';

declare module '@angular/forms/forms' {
  interface FormGroup extends AbstractControl {
    getDirtyValues(): { [key: string]: any };
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
