import { CommonColumns } from './common-history';
import { GameMode } from './game-mode';
import { Character } from './character';

export interface GameModeCharacter extends CommonColumns {
  idGameMode: number;
  gameMode: GameMode;
  idCharacter: number;
  character?: Character;
}

export interface GameModeCharacterAddDto {
  idGameMode: number;
  idCharacter: number;
}
