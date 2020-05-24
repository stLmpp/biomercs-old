import { Injectable } from '@angular/core';
import { Game } from '../../model/game';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class GameStore extends EntityStore<Game> {
  constructor() {
    super({ name: 'game', cache: 900_000 });
  }
}
