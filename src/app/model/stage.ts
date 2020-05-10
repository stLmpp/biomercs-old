import { CommonColumns } from './common-history';
import { Game } from './game';
import { FileUpload } from './file-upload';

export interface Stage extends CommonColumns {
  name: string;
  shortName: string;
  idGame: number;
  game?: Game;
  idImage?: number;
  image?: FileUpload;
  customUrl?: boolean;
  custom?: boolean;
}

export interface StageAddDto {
  name: string;
  shortName: string;
  idGame: number;
  custom?: boolean;
  customUrl?: boolean;
}

export type StageUpdateDto = Partial<StageAddDto>;
