import { CommonColumns } from './common-history';
import { FileUpload } from './file-upload';
import { trackByFactory } from '../util/util';

export enum PlatformTypeEnum {
  console1 = 'console1',
  console2 = 'console2',
  pc = 'pc',
}

export interface Platform extends CommonColumns {
  name: string;
  shortName: string;
  type: PlatformTypeEnum;
  idLogo?: number;
  logo?: FileUpload;
}

export interface PlatformAddDto {
  name: string;
  shortName: string;
  type: PlatformTypeEnum;
}

export type PlatformUpdateDto = Partial<PlatformAddDto>;

export const trackByPlatform = trackByFactory<Platform>('id');
