import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PlatformStore, PlatformState } from './platform.store';

@Injectable({ providedIn: 'root' })
export class PlatformQuery extends QueryEntity<PlatformState> {
  constructor(protected store: PlatformStore) {
    super(store);
  }

  all$ = this.selectAll();
}
