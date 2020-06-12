import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'find', pure: false })
export class FindPipe implements PipeTransform {
  transform<T, K extends keyof T>(array: T[], key: K, term: T[K]): T {
    if (!array?.length || !key || !term) {
      return undefined;
    }
    return array.find(value => value[key] === term);
  }
}
