import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GameMode } from '../../model/game-mode';

export interface GameModeState extends EntityState<GameMode> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game-mode', cache: { ttl: 900_000 } })
export class GameModeStore extends EntityStore<GameModeState> {
  constructor() {
    super();
  }
}
