import { Injectable } from '@angular/core';
import { PlatformStore } from './platform.store';
import { EntityQuery } from '@stlmpp/store';
import { Platform } from '../../model/platform';
import { orderByOperator } from '@stlmpp/utils';

@Injectable({ providedIn: 'root' })
export class PlatformQuery extends EntityQuery<Platform> {
  constructor(protected store: PlatformStore) {
    super(store);
  }

  all$ = this.all$.pipe(orderByOperator('order'));
}
