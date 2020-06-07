import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameModeCharacterStore } from './game-mode-character.store';
import { GameModeCharacterQuery } from './game-mode-character.query';
import {
  GameModeCharacter,
  GameModeCharacterAddDto,
} from '../../model/game-mode-character';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class GameModeCharacterService extends SuperService<
  GameModeCharacter,
  GameModeCharacterAddDto
> {
  constructor(
    private gameModeCharacterStore: GameModeCharacterStore,
    private http: HttpClient,
    private gameModeCharacterQuery: GameModeCharacterQuery
  ) {
    super({
      http,
      store: gameModeCharacterStore,
      query: gameModeCharacterQuery,
      options: {
        endPoint: 'game-mode-character',
      },
    });
  }
}
