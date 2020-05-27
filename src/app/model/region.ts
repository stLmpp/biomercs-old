import { CommonColumns } from './common-history';
import { SuperParamsDto } from '../shared/super/super-params.dto';
import { trackByFactory } from '../util/util';

export interface Region extends CommonColumns {
  name: string;
  shortName: string;
}

export interface RegionAddDto {
  name: string;
  shortName: string;
}

export interface RegionUpdateDto {
  name?: string;
  shortName?: string;
}

export interface RegionExistsDto extends SuperParamsDto {
  name?: string;
  shortName?: string;
}

export const trackByRegion = trackByFactory<Region>('id');
