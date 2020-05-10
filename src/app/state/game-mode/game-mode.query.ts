import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GameModeStore, GameModeState } from './game-mode.store';

@Injectable({ providedIn: 'root' })
export class GameModeQuery extends QueryEntity<GameModeState> {
  constructor(protected store: GameModeStore) {
    super(store);
  }

  all$ = this.selectAll();
}
