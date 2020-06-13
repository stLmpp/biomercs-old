import { CommonColumns } from './common-history';
import { Stage } from './stage';
import { GameMode } from './game-mode';

export interface GameModeStage extends CommonColumns {
  idStage: number;
  stage?: Stage;
  idGameMode: number;
  gameMode?: GameMode;
  maxEnemies: number;
  maxCombo: number;
}

export interface GameModeStageAddDto {
  idStage: number;
  idGameMode: number;
}

export interface GameModeStageUpdateDto {
  maxEnemies?: number;
  maxCombo?: number;
}

export interface GameModeStageParamsDto {
  idStage?: number;
  idGame?: number;
  idMode?: number;
}
