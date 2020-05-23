import { Injectable } from '@angular/core';
import { TypeStore } from './type.store';
import { EntityQuery } from 'st-store';
import { Type } from '../../model/type';

@Injectable({ providedIn: 'root' })
export class TypeQuery extends EntityQuery<Type> {
  constructor(protected store: TypeStore) {
    super(store);
  }
}
