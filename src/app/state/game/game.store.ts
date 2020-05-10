import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Game } from '../../model/game';

export interface GameState extends EntityState<Game> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game', cache: { ttl: 900_000 } })
export class GameStore extends EntityStore<GameState> {
  constructor() {
    super();
  }
}
