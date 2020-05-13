import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Site } from '../../model/site';

export interface SiteState extends EntityState<Site> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'site', cache: { ttl: 900_000 } })
export class SiteStore extends EntityStore<SiteState> {
  constructor() {
    super();
  }
}
