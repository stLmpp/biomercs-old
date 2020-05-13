import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameModeCharacterStore } from './game-mode-character.store';
import { GameModeCharacterQuery } from './game-mode-character.query';
import { SuperService } from '../../shared/super/super-service';
import {
  GameModeCharacter,
  GameModeCharacterAddDto,
} from '../../model/game-mode-character';

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
    super(http, gameModeCharacterStore, gameModeCharacterQuery, {
      endPoint: 'game-mode-character',
    });
  }
}
