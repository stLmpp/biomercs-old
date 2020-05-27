import { EntityStore } from '@stlmpp/store';
import { Region } from '../../model/region';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegionStore extends EntityStore<Region> {
  constructor() {
    super({ name: 'region', cache: 9_000_000_000 });
  }
}
