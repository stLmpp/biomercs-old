import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'is-what';
import { getDeep } from '../get-deep/get-deep.pipe';

export function search<T = any>(
  array: T[],
  keyOrKeys: keyof T | (keyof T)[] | string | string[],
  term: any,
  reverse = false
): T[] {
  if (!array?.length || !keyOrKeys || !term) {
    return array;
  }
  term = ('' + term)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const keys = isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  return array.filter(val => {
    return keys.some(key => {
      const valKey = ('' + getDeep(val, key as string))
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return reverse ? !valKey.includes(term) : valKey.includes(term);
    });
  });
}

@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  transform<T = any>(
    value: T[],
    keyOrKeys: keyof T | (keyof T)[] | string | string[],
    term: any,
    reverse = false
  ): T[] {
    return search(value, keyOrKeys, term, reverse);
  }
}
