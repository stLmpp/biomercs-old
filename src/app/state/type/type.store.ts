import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Type } from '../../model/type';

export interface TypeState extends EntityState<Type> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'type', cache: { ttl: 900_000 } })
export class TypeStore extends EntityStore<TypeState> {
  constructor() {
    super();
  }
}
