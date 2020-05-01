import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';

export function sum(values: number[]): number {
  if (!values?.length) return 0;
  return values.reduce((acc, item) => acc + +(item ?? 0), 0);
}

export function sumBy<T = any>(values: T[], key: keyof T): number {
  if (!values?.length || !key) return 0;
  return values.reduce((acc, item) => acc + +(item?.[key] ?? 0), 0);
}

export const sumOperator = () => map<number[], number>(values => sum(values));
export const sumByOperator = <T>(key: keyof T) =>
  map<T[], number>(values => sumBy(values, key));

@Pipe({ name: 'sumBy' })
export class SumByPipe implements PipeTransform {
  transform<T = any>(value: T[], key: keyof T): number {
    if (!value?.length || !key) return 0;
    return sumBy(value, key);
  }
}
