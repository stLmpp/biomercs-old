import { CommonColumns } from './common-history';
import { GameMode } from './game-mode';
import { Type } from './type';

export interface GameModeType extends CommonColumns {
  idGameMode: number;
  gameMode: GameMode;
  idType: number;
  type: Type;
}

export interface GameModeTypeAddDto {
  idGameMode: number;
  idType: number;
}
