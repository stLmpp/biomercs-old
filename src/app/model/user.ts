import { UserLink } from './user-link';
import { UserRole } from './user-role';
import { FileUpload } from './file-upload';
import { CommonColumns } from './common-history';
import { Region } from './region';
import { UserFollower } from './user-follower';
import { trackByFactory } from '../util/util';

export interface User extends CommonColumns {
  username: string;
  email: string;
  lastOnline: Date;
  userLinks?: UserLink[];
  rememberMe: boolean;
  userRoles?: UserRole[];
  idAvatar?: number;
  avatar?: FileUpload;
  token: string;

  idRegion?: number;
  region: Region;

  expired?: boolean;
  resetToken?: string;

  userFollowers?: UserFollower[];
  userFollowed?: UserFollower[];

  aboutMe?: string;
  title?: string;
}

export interface Auth {
  user: User;
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserRegisterResponse {
  message: string;
  email: string;
}

export interface UserUpdateDto {
  email?: string;
}

export interface UserForgotPasswordDto {
  usernameOrEmail: string;
}

export interface UserConfirmForgotPasswordDto {
  idUser: number;
  token: string;
}

export interface UserChangePasswordDto {
  password: string;
}

export const trackByUser = trackByFactory<User>('id');
