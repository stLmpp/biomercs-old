import { CommonColumns } from './common-history';
import { FileUpload } from './file-upload';
import { SuperParamsDto } from '../shared/super/super-params.dto';
import { trackByFactory } from '../util/util';

export interface Game extends CommonColumns {
  name: string;
  shortName: string;
  idLogo?: number;
  logo?: FileUpload;
}

export interface GameAddDto {
  name: string;
  shortName: string;
}

export type GameUpdateDto = Partial<GameAddDto>;

export interface GameExistsDto extends SuperParamsDto {
  name?: string;
  shortName?: string;
}

export interface GameParamsDto extends GameExistsDto {
  idPlatform?: number;
}

export const trackByGame = trackByFactory<Game>('id');
