import { CommonColumns } from './common-history';
import { Game } from './game';
import { FileUpload } from './file-upload';
import { trackByFactory } from '@stlmpp/utils';

export interface Stage extends CommonColumns {
  name: string;
  shortName: string;
  idGame: number;
  game?: Game;
  idImage?: number;
  image?: FileUpload;
  customUrl?: boolean;
  custom?: boolean;
  order?: number;
}

export interface StageAddDto {
  name: string;
  shortName: string;
  idGame: number;
  custom?: boolean;
  customUrl?: boolean;
  order?: number;
}

export type StageUpdateDto = Partial<StageAddDto>;

export interface StageParamsDto extends StageUpdateDto {
  idMode?: number;
}

export const trackByStage = trackByFactory<Stage>('id');
