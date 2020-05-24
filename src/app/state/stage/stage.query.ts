import { Injectable } from '@angular/core';
import { StageStore } from './stage.store';
import { EntityQuery } from '@stlmpp/store';
import { Stage } from '../../model/stage';

@Injectable({ providedIn: 'root' })
export class StageQuery extends EntityQuery<Stage> {
  constructor(protected store: StageStore) {
    super(store);
  }
}
