import { Injectable } from '@angular/core';
import { SiteStore } from './site.store';
import { EntityQuery } from '@stlmpp/store';
import { Site } from '../../model/site';

@Injectable({ providedIn: 'root' })
export class SiteQuery extends EntityQuery<Site> {
  constructor(protected store: SiteStore) {
    super(store);
  }
}
