import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Platform } from '../../model/platform';

export interface PlatformState extends EntityState<Platform> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'platform' })
export class PlatformStore extends EntityStore<PlatformState> {
  constructor() {
    super();
  }
}
