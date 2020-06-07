import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameModeTypeStore } from './game-mode-type.store';
import { GameModeType, GameModeTypeAddDto } from '../../model/game-mode-type';
import { GameModeTypeQuery } from './game-mode-type.query';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class GameModeTypeService extends SuperService<GameModeType, GameModeTypeAddDto> {
  constructor(
    private gameModeTypeStore: GameModeTypeStore,
    private http: HttpClient,
    private gameModeTypeQuery: GameModeTypeQuery
  ) {
    super({
      http,
      store: gameModeTypeStore,
      query: gameModeTypeQuery,
      options: {
        endPoint: 'game-mode-type',
        excludeMethods: ['search', 'exists', 'findByParams', 'update'],
      },
    });
  }
}
