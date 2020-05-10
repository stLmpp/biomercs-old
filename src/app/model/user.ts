import { UserLink } from './user-link';
import { UserRole } from './user-role';
import { FileUpload } from './file-upload';

export interface User {
  id: number;
  username: string;
  email: string;
  lastOnline: Date;
  userLinks?: UserLink[];
  rememberMe: boolean;
  userRoles?: UserRole[];
  idAvatar?: number;
  avatar?: FileUpload;
  token: string;
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
