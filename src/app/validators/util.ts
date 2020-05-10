import { map } from 'rxjs/operators';
import { ValidationErrors } from '@angular/forms';

export const mapToError = <T>(key: string, value: any = true) =>
  map<T, ValidationErrors>(returnValue =>
    returnValue ? { [key]: value } : null
  );
