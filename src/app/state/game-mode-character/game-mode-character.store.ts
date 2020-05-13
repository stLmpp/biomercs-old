import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GameModeCharacter } from '../../model/game-mode-character';

export interface GameModeCharacterState
  extends EntityState<GameModeCharacter> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game-mode-character', cache: { ttl: 900_000 } })
export class GameModeCharacterStore extends EntityStore<
  GameModeCharacterState
> {
  constructor() {
    super();
  }
}
