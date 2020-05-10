import { Injectable } from '@angular/core';
import { GameStore } from './game.store';
import {
  Game,
  GameAddDto,
  GameExistsDto,
  GameParamsDto,
  GameUpdateDto,
} from '../../model/game';
import { HttpClient } from '@angular/common/http';
import { SuperService } from '../../shared/super/super-service';
import { GameQuery } from './game.query';

@Injectable({ providedIn: 'root' })
export class GameService extends SuperService<
  Game,
  GameAddDto,
  GameUpdateDto,
  GameExistsDto,
  GameParamsDto
> {
  constructor(
    private http: HttpClient,
    private gameStore: GameStore,
    private gameQuery: GameQuery
  ) {
    super(http, gameStore, gameQuery, {
      endPoint: 'game',
      file: {
        idKey: 'idLogo',
        key: 'logo',
      },
    });
  }
}
