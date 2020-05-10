import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ModeStore, ModeState } from './mode.store';

@Injectable({ providedIn: 'root' })
export class ModeQuery extends QueryEntity<ModeState> {
  constructor(protected store: ModeStore) {
    super(store);
  }

  all$ = this.selectAll();
}
