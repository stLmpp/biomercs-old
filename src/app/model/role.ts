export enum RoleEnum {
  user = 'User',
  admin = 'Admin',
}

export interface Role {
  id: number;
  name: RoleEnum;
  description: string;
}
