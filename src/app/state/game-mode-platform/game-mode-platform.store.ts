import { Injectable } from '@angular/core';
import { GameModePlatform } from '../../model/game-mode-platform';
import { EntityStore } from 'st-store';

@Injectable({ providedIn: 'root' })
export class GameModePlatformStore extends EntityStore<GameModePlatform> {
  constructor() {
    super({ name: 'game-mode-platform', cache: 900_000 });
  }
}
