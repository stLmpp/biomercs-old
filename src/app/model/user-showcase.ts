import { CommonColumns } from './common-history';

export interface UserShowcase extends CommonColumns {
  idUser: number;
  idPlatform?: number;
  idGame?: number;
  idMode?: number;
  idType?: number;
}

export interface UsershowcaseUpdateDto {
  idPlatform?: number;
  idGame?: number;
  idMode?: number;
  idType?: number;
}

export interface UserShowcaseParamsDto {
  idUser: number;
}
