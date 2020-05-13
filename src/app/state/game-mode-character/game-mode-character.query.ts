import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  GameModeCharacterStore,
  GameModeCharacterState,
} from './game-mode-character.store';

@Injectable({ providedIn: 'root' })
export class GameModeCharacterQuery extends QueryEntity<
  GameModeCharacterState
> {
  constructor(protected store: GameModeCharacterStore) {
    super(store);
  }

  all$ = this.selectAll();
}
