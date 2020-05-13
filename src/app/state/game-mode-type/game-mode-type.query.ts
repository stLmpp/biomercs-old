import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GameModeTypeStore, GameModeTypeState } from './game-mode-type.store';

@Injectable({ providedIn: 'root' })
export class GameModeTypeQuery extends QueryEntity<GameModeTypeState> {
  constructor(protected store: GameModeTypeStore) {
    super(store);
  }

  all$ = this.selectAll();
}
