import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Mode } from '../../model/mode';

export interface ModeState extends EntityState<Mode> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mode', cache: { ttl: 900_000 } })
export class ModeStore extends EntityStore<ModeState> {
  constructor() {
    super();
  }
}
