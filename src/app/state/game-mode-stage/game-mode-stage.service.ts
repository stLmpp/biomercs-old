import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import { GameModeStage, GameModeStageAddDto, GameModeStageUpdateDto } from '../../model/game-mode-stage';
import { HttpClient } from '@angular/common/http';
import { GameModeStageStore } from './game-mode-stage.store';
import { GameModeStageQuery } from './game-mode-stage.query';

@Injectable({ providedIn: 'root' })
export class GameModeStageService extends SuperService<
  GameModeStage,
  GameModeStageAddDto,
  GameModeStageUpdateDto
> {
  constructor(
    private http: HttpClient,
    private gameModeStageStore: GameModeStageStore,
    private gameModeStageQuery: GameModeStageQuery
  ) {
    super({
      http,
      store: gameModeStageStore,
      query: gameModeStageQuery,
      options: { endPoint: 'game-mode-stage' },
    });
  }
}
