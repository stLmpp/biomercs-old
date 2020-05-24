import { Injectable } from '@angular/core';
import { GameModeTypeStore } from './game-mode-type.store';
import { EntityQuery } from '@stlmpp/store';
import { GameModeType } from '../../model/game-mode-type';

@Injectable({ providedIn: 'root' })
export class GameModeTypeQuery extends EntityQuery<GameModeType> {
  constructor(protected store: GameModeTypeStore) {
    super(store);
  }
}
