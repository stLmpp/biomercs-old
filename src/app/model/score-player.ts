import { CommonColumns } from './common-history';
import { User } from './user';
import { Character } from './character';

export interface ScorePlayer extends CommonColumns {
  idScore: number;
  idPlayer: number;
  player: User;
  idCharacter: number;
  character: Character;
  host: boolean;
  bulletKils: number;
}

export interface ScorePlayerAddDto {
  idScore?: number;
  idPlayer: number;
  idCharacter: number;
  host?: boolean;
  bulletKils?: number;
}
