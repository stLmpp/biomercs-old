import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GameModeType } from '../../model/game-mode-type';

export interface GameModeTypeState extends EntityState<GameModeType> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game-mode-type' })
export class GameModeTypeStore extends EntityStore<GameModeTypeState> {
  constructor() {
    super();
  }
}
