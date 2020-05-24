import { Injectable } from '@angular/core';
import { GameModeCharacterStore } from './game-mode-character.store';
import { EntityQuery } from '@stlmpp/store';
import { GameModeCharacter } from '../../model/game-mode-character';

@Injectable({ providedIn: 'root' })
export class GameModeCharacterQuery extends EntityQuery<GameModeCharacter> {
  constructor(protected store: GameModeCharacterStore) {
    super(store);
  }
}
