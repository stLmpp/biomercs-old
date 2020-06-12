import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'is-what';
import { isKeyof, isNil } from '../../util/util';

export type FilterByType<T = any> = keyof T | (keyof T)[];

export function filter<T>(array: T[], filterBy: FilterByType<T>, term: any, reverse = false): T[] {
  if (!array?.length || !filterBy) return array;
  if (!isArray(term)) term = [term].filter(o => !isNil(o));
  if (!term.length) return array;
  if (isKeyof<T>(filterBy)) {
    if (isNil(term)) {
      return array;
    }
    return array.filter(val => (reverse ? !term.includes(val[filterBy]) : term.includes(val[filterBy])));
  } else if (isArray(filterBy)) {
    if (isNil(term)) {
      return array;
    }
    return array.filter(val =>
      reverse ? !filterBy.some(key => term.includes(val[key])) : filterBy.some(key => term.includes(val[key]))
    );
  } else {
    return array;
  }
}

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform<T>(value: T[], filterBy: FilterByType<T>, term: any, reverse?: boolean): T[] {
    return filter(value, filterBy, term, reverse);
  }
}
