import { isArray, isNumber, isObject, isString } from 'is-what';
import { ID } from '@stlmpp/utils';
import { Control } from '@ng-stack/forms';

export type CompareFn<T = any> = (valueA: T, valueB: T) => boolean;
export type Constructor<T = any> = new (...args: any[]) => T;
export type Dictionary<T = any, K extends ID = number> = Record<K, T>;
export type ToControls<T> = {
  [P in keyof T]: T[P] extends object
    ? Control<T[P]>
    : T[P] extends Date
    ? Control<T[P]>
    : T[P] extends any[]
    ? Control<T[P]>
    : T[P];
};
export type OrderByDirection = 'ASC' | 'DESC';

export const compareByFactory = <T = any>(key: keyof T): CompareFn<T> => (valueA, valueB) =>
  valueA?.[key] === valueB?.[key];

export function isNil(value: any): value is null | undefined {
  return value == null;
}

export function isKeyof<T = any>(value: any): value is keyof T {
  return isString(value);
}

export function isEmpty(value: any): boolean {
  return (
    (isArray(value) && !value.length) ||
    (isObject(value) && !Object.keys(value).length) ||
    (isString(value) && value === '')
  );
}

export function convertToBoolProperty(val: any): boolean {
  if (isString(val)) {
    val = val.toLowerCase().trim();
    return val === 'true' || val === '';
  }
  return !!val;
}

export type RemoveNullObjectCheckType = 'strict' | 'loose';

export function removeNullObject<T = any>(object: T, checkType: RemoveNullObjectCheckType = 'strict'): T {
  if (!object) return object;
  let checkFn: (value: T) => boolean;
  if (checkType === 'loose') {
    checkFn = value => {
      if (isNumber(value)) {
        return value === 0 ? true : !!value;
      } else {
        return !!value;
      }
    };
  } else if (checkType === 'strict') {
    checkFn = value => !isNil(value);
  }
  return Object.entries(object).reduce((obj, [key, value]) => {
    if (checkFn(value)) {
      obj[key] = value;
    }
    return obj;
  }, {}) as T;
}

export function isAllNull<T = any>(obj: T): boolean {
  return !obj || Object.values(obj).every(isNil);
}

export function getFileExtesion(fname: string): string {
  // tslint:disable-next-line:no-bitwise
  return fname.slice(((fname.lastIndexOf('.') - 1) >>> 0) + 2);
}
