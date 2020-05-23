import { Injectable } from '@angular/core';
import { GameModeType } from '../../model/game-mode-type';
import { EntityStore } from 'st-store';

@Injectable({ providedIn: 'root' })
export class GameModeTypeStore extends EntityStore<GameModeType> {
  constructor() {
    super({ name: 'game-mode-type', cache: 900_000 });
  }
}
