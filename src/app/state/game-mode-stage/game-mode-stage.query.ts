import { EntityQuery } from '@stlmpp/store';
import { GameModeStage } from '../../model/game-mode-stage';
import { Injectable } from '@angular/core';
import { GameModeStageStore } from './game-mode-stage.store';

@Injectable({ providedIn: 'root' })
export class GameModeStageQuery extends EntityQuery<GameModeStage> {
  constructor(private gameModeStageStore: GameModeStageStore) {
    super(gameModeStageStore);
  }
}
