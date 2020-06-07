import { RoleEnum } from './role';

export interface SideMenu {
  title: string;
  routerLink: string;
  active?: boolean;
  padding?: boolean;
  auth?: RoleEnum[];
}
