import { CommonColumns } from './common-history';
import { GameMode } from './game-mode';
import { Platform } from './platform';

export interface GameModePlatform extends CommonColumns {
  idGameMode: number;
  gameMode: GameMode;
  idPlatform: number;
  platform: Platform;
}

export interface GameModePlatformAddDto {
  idGameMode: number;
  idPlatform: number;
}
