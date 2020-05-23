import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameModePlatformStore } from './game-mode-platform.store';
import { GameModePlatformQuery } from './game-mode-platform.query';
import {
  GameModePlatform,
  GameModePlatformAddDto,
} from '../../model/game-mode-platform';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class GameModePlatformService extends SuperService<
  GameModePlatform,
  GameModePlatformAddDto
> {
  constructor(
    private gameModePlatformStore: GameModePlatformStore,
    private http: HttpClient,
    private gameModePlatformQuery: GameModePlatformQuery
  ) {
    super(http, gameModePlatformStore, gameModePlatformQuery, {
      endPoint: 'game-mode-platform',
      excludeMethods: ['update', 'findByParams', 'exists', 'search'],
    });
  }
}
