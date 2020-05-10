import { CommonColumns } from './common-history';

export interface Site extends CommonColumns {
  name: string;
  url: string;
  icon?: string;
}

export interface SiteAddDto {
  name: string;
  url: string;
  icon?: string;
}
export type SiteUpdateDto = Partial<SiteAddDto>;
