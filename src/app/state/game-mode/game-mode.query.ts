import { Injectable } from '@angular/core';
import { GameModeStore } from './game-mode.store';
import { EntityQuery } from 'st-store';
import { GameMode } from '../../model/game-mode';

@Injectable({ providedIn: 'root' })
export class GameModeQuery extends EntityQuery<GameMode> {
  constructor(protected store: GameModeStore) {
    super(store);
  }
}
