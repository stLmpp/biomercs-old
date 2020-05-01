import { HttpParams as OriginHttpParams } from '@angular/common/http';
import { isDate } from 'is-what';

export class HttpParams extends OriginHttpParams {
  constructor(fromObject?: { [id: string]: any }) {
    if (fromObject) {
      fromObject = Object.entries(fromObject).reduce((obj, [key, value]) => {
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
