import { HttpParams as OriginHttpParams } from '@angular/common/http';
import { isDate } from 'is-what';
import { isNil } from './util';

export class HttpParams extends OriginHttpParams {
  constructor(fromObject?: { [id: string]: any }, excludeNil?: boolean) {
    if (fromObject) {
      let entries = Object.entries(fromObject);
      if (excludeNil) {
        entries = entries.filter(([_, value]) => !isNil(value) && value !== '');
      }
      fromObject = entries.reduce((obj, [key, value]) => {
        return { ...obj, [key]: convertToString(value) };
      }, {});
      super({ fromObject });
    } else {
      super();
    }
  }

  append(param: string, value: any): HttpParams {
    return super.append(param, convertToString(value));
  }

  set(param: string, value: any): HttpParams {
    return super.set(param, convertToString(value));
  }
}

const convertToString = (value: any) =>
  isDate(value) ? value.toISOString() : '' + value;
