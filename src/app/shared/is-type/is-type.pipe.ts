import { Pipe, PipeTransform } from '@angular/core';
import { getType } from 'is-what';

@Pipe({
  name: 'isType',
})
export class IsTypePipe implements PipeTransform {
  transform(value: any, type: string): boolean {
    return getType(value) === type;
  }
}
