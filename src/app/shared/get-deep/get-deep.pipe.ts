import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'is-what';

export function getDeep<T = any, R = any>(obj: T, path: string | string[]): R {
  if (!isArray(path)) path = path.split('.');
  return path.reduce((acc, key) => acc?.[key], obj);
}

@Pipe({ name: 'getDeep' })
export class GetDeepPipe implements PipeTransform {
  transform<T = any, R = any>(value: T, key: string | string[]): R {
    return getDeep(value, key);
  }
}
