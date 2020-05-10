import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Stage } from '../../model/stage';

export interface StageState extends EntityState<Stage> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stage' })
export class StageStore extends EntityStore<StageState> {
  constructor() {
    super();
  }
}