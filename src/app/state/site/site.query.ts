import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SiteStore, SiteState } from './site.store';

@Injectable({ providedIn: 'root' })
export class SiteQuery extends QueryEntity<SiteState> {
  constructor(protected store: SiteStore) {
    super(store);
  }

  all$ = this.selectAll();
}
