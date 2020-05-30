import { CommonColumns } from './common-history';
import { GameModePlatform } from './game-mode-platform';
import { Stage } from './stage';
import { Type } from './type';
import { ScorePlayer, ScorePlayerAddDto } from './score-player';
import { Character } from './character';
import { User } from './user';

export interface Score extends CommonColumns {
  idGameModePlatform: number;
  gameModePlatform?: GameModePlatform;
  idStage: number;
  stage?: Stage;
  idType: number;
  type: Type;
  scorePlayers: ScorePlayer[];
  score: number;
  maxCombo?: number;
  time?: string;
}

export interface ScoreAddDto {
  idGame: number;
  idMode: number;
  idPlatform: number;
  idStage: number;
  idType: number;
  scorePlayers: ScorePlayerAddDto[];
  score: number;
  maxCombo?: number;
  time?: string;
  description?: string;
}

export interface ScoreTable {
  stage: Stage;
  character?: Character;
  player?: User;
  score?: Score;
}

export enum ScoreTableType {
  character,
  top,
}

export interface ScoreTableParamsDto {
  idPlatform: number;
  idGame: number;
  idMode: number;
  idType: number;
  idCharacter?: number;
  idPlayer?: number;
  limit?: number;
  type: ScoreTableType;
}
