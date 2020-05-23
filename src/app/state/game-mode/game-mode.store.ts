import { Injectable } from '@angular/core';
import { GameMode } from '../../model/game-mode';
import { EntityStore } from 'st-store';

@Injectable({ providedIn: 'root' })
export class GameModeStore extends EntityStore<GameMode> {
  constructor() {
    super({ name: 'game-mode', cache: 900_000 });
  }
}
