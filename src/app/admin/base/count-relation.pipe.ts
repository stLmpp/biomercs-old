import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countRelation',
})
export class CountRelationPipe implements PipeTransform {
  transform(value: any[], [id, key]: [number, string]): number {
    return (value ?? []).filter(o => o[key] === id).length;
  }
}
