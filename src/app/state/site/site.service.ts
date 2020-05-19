import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteStore } from './site.store';
import { SiteQuery } from './site.query';
import { SuperService } from '../../shared/super/super-service';
import { Site, SiteAddDto, SiteUpdateDto } from '../../model/site';
import { replaceParams } from '../../shared/replace-params/replace-params.pipe';

@Injectable({ providedIn: 'root' })
export class SiteService extends SuperService<
  Site,
  SiteAddDto,
  SiteUpdateDto,
  SiteUpdateDto,
  SiteUpdateDto
> {
  constructor(
    private siteStore: SiteStore,
    private http: HttpClient,
    private siteQuery: SiteQuery
  ) {
    super(http, siteStore, siteQuery, {
      endPoint: 'site',
    });
  }

  handleUrl(site: Site, url: string, urlKey: string): string {
    if (/(^http(s)?|^www)/.test(url)) {
      return url;
    } else {
      return replaceParams(site.replace, { url: site.url, [urlKey]: url });
    }
  }
}
