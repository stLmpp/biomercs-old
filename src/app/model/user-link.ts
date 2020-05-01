import { Site } from './site';

export interface UserLink {
  id: number;
  url: string;
  name: string;
  idUser: number;
  idSite: number;
  site: Site;
}
