import { Pipe, PipeTransform } from '@angular/core';

export function replaceParams(value: string, args: { [key: string]: any }): string {
  if (!value || !args) {
    return value;
  }
  return Object.entries(args).reduce((acc, [key, newValue]) => {
    return acc.split(`{${key}}`).join(newValue);
  }, value);
}

@Pipe({ name: 'replaceParams' })
export class ReplaceParamsPipe implements PipeTransform {
  transform(value: string, args: { [key: string]: any }): string {
    return replaceParams(value, args);
  }
}
