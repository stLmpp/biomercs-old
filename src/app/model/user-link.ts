import { Site } from './site';
import { trackByFactory } from '@stlmpp/utils';
import { CommonColumns } from './common-history';

export interface UserLink extends CommonColumns {
  url: string;
  name: string;
  idUser: number;
  idSite: number;
  site: Site;
}

export interface UserLinkAddDto {
  name: string;
  url: string;
  idSite: number;
  idUser: number;
}

export interface UserLinkUpdateDto {
  name?: string;
  url?: string;
  idSite?: number;
}

export interface UserLinkParamsDto {
  url?: string;
  name?: string;
  idSite?: number;
  idUser?: number;
}

export const trackByUserLink = trackByFactory<UserLink>('id');
