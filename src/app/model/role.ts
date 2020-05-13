export enum RoleEnum {
  user = 'user',
  admin = 'admin',
}

export interface Role {
  id: number;
  name: RoleEnum;
  description: string;
}
