import { Role } from './role';
import { CommonColumns } from './common-history';

export interface UserRole extends CommonColumns {
  idUser: number;
  idRole: number;
  role: Role;
}

export interface UserRoleAddDto {
  idUser: number;
  idRole: number;
}

export interface UserRoleParamsDto {
  idUser?: number;
  idRole?: number;
}
