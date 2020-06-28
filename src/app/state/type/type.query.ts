import { Injectable } from '@angular/core';
import { TypeStore } from './type.store';
import { EntityQuery } from '@stlmpp/store';
import { Type } from '../../model/type';
import { orderByOperator } from '@stlmpp/utils';

@Injectable({ providedIn: 'root' })
export class TypeQuery extends EntityQuery<Type> {
  constructor(protected store: TypeStore) {
    super(store);
  }

  all$ = this.all$.pipe(orderByOperator('order'));
}
