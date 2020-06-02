import { CommonColumns } from './common-history';
import { ReferenceTypeEnum } from './reference-type.enum';
import { Score } from './score';
import { User } from './user';
import { SuperParamsDto } from '../shared/super/super-params.dto';

export enum LikeStyleEnum {
  like = 'like',
  love = 'love',
}

export interface Like extends CommonColumns {
  type: ReferenceTypeEnum;
  style: LikeStyleEnum;
  idReference: number;
  userLiked?: User;
  scoreLiked?: Score;
}

export interface LikeAddDto {
  type: ReferenceTypeEnum;
  style: LikeStyleEnum;
  idReference: number;
}

export interface LikeUpdateDto {
  style?: LikeStyleEnum;
}

export interface LikeParamsDto extends SuperParamsDto {
  type?: ReferenceTypeEnum;
  style?: LikeStyleEnum;
  idReference?: number;
}

export interface LikeDeleteDto {
  type: ReferenceTypeEnum;
  idReference: number;
  style?: LikeStyleEnum;
}

export interface LikeCount {
  like: number;
  love: number;
}
