import { CommonColumns } from './common-history';
import { GameModePlatform } from './game-mode-platform';
import { Stage } from './stage';
import { Type } from './type';
import { ScorePlayer, ScorePlayerAddDto } from './score-player';
import { Character } from './character';
import { User } from './user';
import { trackByFactory } from '@stlmpp/utils';

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

  isWorldRecord?: boolean;
  wordRecord?: Score;
  isCharacterWorldRecords?: boolean;
  isCharacterWorldRecord?: { [idCharacter: number]: boolean };
  characterWorldRecords?: Score[];
  isCombinationWorldRecord?: boolean;
  combinationWorldRecord?: Score;
}

export interface ScoreIsWrViewModel {
  isWorldRecord?: boolean;
  wordRecord?: Score;
  isCharacterWorldRecords?: boolean;
  isCharacterWorldRecord?: { [idCharacter: number]: boolean };
  characterWorldRecords?: Score[];
  isCombinationWorldRecord?: boolean;
  combinationWorldRecord?: Score;
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

export interface ScoreRandomDto {
  idGame?: number;
  idMode?: number;
  idType?: number;
  idPlatform?: number;
  idCharacter?: number;
  idStage?: number;
  idPlayer?: number;
}

export interface ScoreTopScoreDto {
  idGame: number;
  idMode: number;
  idType: number;
  idPlatform: number;
  idCharacter?: number;
  idCharacters?: number[];
  idCharactersAnd?: boolean;
  idStage: number;
  idPlayer?: number;
}

export interface ScoreIsWrDto extends Omit<ScoreTopScoreDto, 'idCharacter' | 'idPlayer' | 'idCharactersAnd'> {
  score: number;
}

export const trackByScore = trackByFactory<Score>('id');
