import { CommonColumns } from './common-history';
import { SuperParamsDto } from '../shared/super/super-params.dto';

export interface Type extends CommonColumns {
  name: string;
  playerQuantity: number;
}

export interface TypeAddDto {
  name: string;
  playerQuantity: number;
}

export interface TypeUpdateDto {
  name?: string;
  playerQuantity?: number;
}

export interface TypeExistsDto extends SuperParamsDto {
  name?: string;
  playerQuantity?: number;
}

export interface TypeParamsDto extends TypeExistsDto {
  idGame?: number;
  idMode?: number;
}