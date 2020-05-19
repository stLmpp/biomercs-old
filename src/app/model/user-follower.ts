import { CommonColumns } from './common-history';
import { User } from './user';
import { trackByFactory } from '../util/util';
import { SuperParamsDto } from '../shared/super/super-params.dto';

export interface UserFollower extends CommonColumns {
  idFollowed: number;
  followed: User;
  idFollower: number;
  follower: User;
}

export interface UserFollowerAddDto {
  idFollowed: number;
  idFollower: number;
}

export interface UserFollowerExistsDto extends SuperParamsDto {
  idFollower?: number;
  idFollowed?: number;
}

export const trackByUserFollower = trackByFactory<UserFollower>('id');
