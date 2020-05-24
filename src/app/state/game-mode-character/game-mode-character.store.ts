import { Injectable } from '@angular/core';
import { GameModeCharacter } from '../../model/game-mode-character';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class GameModeCharacterStore extends EntityStore<GameModeCharacter> {
  constructor() {
    super({ name: 'game-mode-character', cache: 900_000 });
  }
}
