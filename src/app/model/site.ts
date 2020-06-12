import { CommonColumns } from './common-history';
import { trackByFactory } from '@stlmpp/utils';

export interface Site extends CommonColumns {
  name: string;
  url: string;
  replace: string;
  icon?: string;
}

export interface SiteAddDto {
  name: string;
  url: string;
  replace: string;
  icon?: string;
}
export type SiteUpdateDto = Partial<SiteAddDto>;

export const trackBySite = trackByFactory<Site>('id');
