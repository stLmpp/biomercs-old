import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TypeStore, TypeState } from './type.store';

@Injectable({ providedIn: 'root' })
export class TypeQuery extends QueryEntity<TypeState> {
  constructor(protected store: TypeStore) {
    super(store);
  }

  all$ = this.selectAll();
}
