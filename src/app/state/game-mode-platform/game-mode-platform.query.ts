import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  GameModePlatformStore,
  GameModePlatformState,
} from './game-mode-platform.store';

@Injectable({ providedIn: 'root' })
export class GameModePlatformQuery extends QueryEntity<GameModePlatformState> {
  constructor(protected store: GameModePlatformStore) {
    super(store);
  }

  all$ = this.selectAll();
}
