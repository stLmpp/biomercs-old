import { CommonColumns } from './common-history';
import { FileUpload } from './file-upload';
import { SuperParamsDto } from '../shared/super/super-params.dto';

export interface Character extends CommonColumns {
  name: string;
  shortName: string;
  idImage?: number;
  image?: FileUpload;
}

export interface CharacterAddDto {
  name: string;
  shortName: string;
}

export type CharacterUpdateDto = Partial<CharacterAddDto>;

export interface CharacterExistsDto extends SuperParamsDto {
  name?: string;
  shortName?: string;
}

export interface CharacterParamsDto extends CharacterExistsDto {
  idGame?: number;
  idMode?: number;
}
