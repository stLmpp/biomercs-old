import { Pipe, PipeTransform } from '@angular/core';
import { CommonColumns } from '../../model/common-history';

@Pipe({ name: 'mapRelation' })
export class MapRelationPipe implements PipeTransform {
  transform(entities: CommonColumns[], ids: [number, string][]): CommonColumns {
    return entities.find(entity => {
      return ids.every(([id, key]) => {
        return entity[key] === id;
      });
    });
  }
}
