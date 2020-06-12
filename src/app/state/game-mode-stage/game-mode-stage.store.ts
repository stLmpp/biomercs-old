import { EntityStore } from '@stlmpp/store';
import { GameModeStage } from '../../model/game-mode-stage';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameModeStageStore extends EntityStore<GameModeStage> {
  constructor() {
    super({ name: 'game-mode-stage', cache: 900_000 });
  }
}
