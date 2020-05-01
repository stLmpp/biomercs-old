import { Role } from './role';

export interface UserRole {
  id: number;
  idUser: number;
  idRole: number;
  role: Role;
}
