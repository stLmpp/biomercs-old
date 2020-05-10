import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameModeStore } from './game-mode.store';
import { GameMode } from '../../model/game-mode';
import { SuperService } from '../../shared/super/super-service';
import { GameModeQuery } from './game-mode.query';

@Injectable({ providedIn: 'root' })
export class GameModeService extends SuperService<GameMode> {
  constructor(
    private http: HttpClient,
    private gameModeStore: GameModeStore,
    private gameModeQuery: GameModeQuery
  ) {
    super(http, gameModeStore, gameModeQuery, {
      endPoint: 'game-mode',
      file: {
        key: 'image',
        idKey: 'idImage',
      },
    });
  }
}
