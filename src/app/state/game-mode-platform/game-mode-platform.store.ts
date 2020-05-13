import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GameModePlatform } from '../../model/game-mode-platform';

export interface GameModePlatformState extends EntityState<GameModePlatform> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game-mode-platform' })
export class GameModePlatformStore extends EntityStore<GameModePlatformState> {
  constructor() {
    super();
  }
}
