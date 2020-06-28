import { CommonColumns } from './common-history';
import { FileUpload } from './file-upload';
import { SuperParamsDto } from '../shared/super/super-params.dto';
import { trackByFactory } from '@stlmpp/utils';

export interface Character extends CommonColumns {
  name: string;
  shortName: string;
  idImage?: number;
  image?: FileUpload;
  order?: number;
}

export interface CharacterAddDto {
  name: string;
  shortName: string;
  order?: number;
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

export const trackByCharacter = trackByFactory<Character>('id');
