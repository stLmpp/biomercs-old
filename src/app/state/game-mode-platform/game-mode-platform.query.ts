import { Injectable } from '@angular/core';
import { GameModePlatformStore } from './game-mode-platform.store';
import { EntityQuery } from '@stlmpp/store';
import { GameModePlatform } from '../../model/game-mode-platform';

@Injectable({ providedIn: 'root' })
export class GameModePlatformQuery extends EntityQuery<GameModePlatform> {
  constructor(protected store: GameModePlatformStore) {
    super(store);
  }
}
