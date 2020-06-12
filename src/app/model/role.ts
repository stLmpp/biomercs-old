import { CommonColumns } from './common-history';
import { trackByFactory } from '@stlmpp/utils';

export enum RoleEnum {
  owner = 'owner',
  user = 'user',
  admin = 'admin',
}

export interface Role extends CommonColumns {
  name: RoleEnum;
  description: string;
}

export interface RoleAddDto {
  name: RoleEnum;
  description?: string;
}

export interface RoleUpdateDto {
  description?: string;
}

export interface RoleExistsDto {
  name?: RoleEnum;
  description?: string;
}

export const trackByRole = trackByFactory<Role>('id');
