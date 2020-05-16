import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Default } from '../../model/default';

export function createInitialState(): Default {
  return {
    avatar: null,
    loading: false,
    imageExtensions: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'default', cache: { ttl: 900_000 } })
export class DefaultStore extends Store<Default> {
  constructor() {
    super(createInitialState());
  }
}
