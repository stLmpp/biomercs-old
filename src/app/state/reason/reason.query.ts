import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { Reason } from '../../model/reason';
import { ReasonStore } from './reason.store';

@Injectable({ providedIn: 'root' })
export class ReasonQuery extends EntityQuery<Reason> {
  constructor(private reasonStore: ReasonStore) {
    super(reasonStore);
  }
}
