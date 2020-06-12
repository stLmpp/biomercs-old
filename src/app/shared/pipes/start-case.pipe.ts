import { Pipe, PipeTransform } from '@angular/core';

export function startCase(str: string): string {
  return str
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase())
    .trim();
}

@Pipe({
  name: 'startCase',
})
export class StartCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }
    return startCase(value);
  }
}
