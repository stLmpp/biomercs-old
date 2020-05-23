import { Injectable } from '@angular/core';
import { PlatformStore } from './platform.store';
import { EntityQuery } from 'st-store';
import { Platform } from '../../model/platform';

@Injectable({ providedIn: 'root' })
export class PlatformQuery extends EntityQuery<Platform> {
  constructor(protected store: PlatformStore) {
    super(store);
  }
}
