import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Site } from '../../model/site';

export interface SiteState extends EntityState<Site> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'site' })
export class SiteStore extends EntityStore<SiteState> {
  constructor() {
    super();
  }
}
