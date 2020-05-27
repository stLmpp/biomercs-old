import { RegionStore } from './region.store';
import { Region } from '../../model/region';
import { EntityQuery } from '@stlmpp/store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegionQuery extends EntityQuery<Region> {
  constructor(private regionStore: RegionStore) {
    super(regionStore);
  }
}
