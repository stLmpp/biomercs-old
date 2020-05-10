import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { StageStore, StageState } from './stage.store';

@Injectable({ providedIn: 'root' })
export class StageQuery extends QueryEntity<StageState> {
  constructor(protected store: StageStore) {
    super(store);
  }

  all$ = this.selectAll();
}
