import { CommonColumns } from './common-history';
import { SuperParamsDto } from '../shared/super/super-params.dto';
import { trackByFactory } from '../util/util';

export interface Mode extends CommonColumns {
  id: number;
  name: string;
}

export interface ModeAddDto {
  name: string;
}

export type ModeUpdateDto = Partial<ModeAddDto>;

export interface ModeExistsDto extends SuperParamsDto {
  name?: string;
}

export interface ModeParamsDto extends ModeExistsDto {
  idGame?: number;
  idPlatform?: number;
}

export const trackByMode = trackByFactory<Mode>('id');
