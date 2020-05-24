import { Injectable } from '@angular/core';
import { ModeStore } from './mode.store';
import { EntityQuery } from '@stlmpp/store';
import { Mode } from '../../model/mode';

@Injectable({ providedIn: 'root' })
export class ModeQuery extends EntityQuery<Mode> {
  constructor(protected store: ModeStore) {
    super(store);
  }
}
