import { CommonColumns } from './common-history';
import { Game } from './game';
import { Mode } from './mode';
import { FileUpload } from './file-upload';

export interface GameMode extends CommonColumns {
  id: number;
  idGame: number;
  game: Game;
  idMode: number;
  mode: Mode;
  idImage?: number;
  image?: FileUpload;
}

export interface GameModeAddDto {
  idGame: number;
  idMode: number;
}
