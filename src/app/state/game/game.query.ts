import { Injectable } from '@angular/core';
import { GameStore } from './game.store';
import { EntityQuery } from '@stlmpp/store';
import { Game } from '../../model/game';

@Injectable({ providedIn: 'root' })
export class GameQuery extends EntityQuery<Game> {
  constructor(protected store: GameStore) {
    super(store);
  }
}
