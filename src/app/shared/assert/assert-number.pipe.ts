import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'assertNumber' })
export class AssertNumberPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}
