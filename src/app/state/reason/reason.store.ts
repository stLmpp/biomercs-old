import { Injectable } from '@angular/core';
import { EntityStore } from '@stlmpp/store';
import { Reason } from '../../model/reason';

@Injectable({ providedIn: 'root' })
export class ReasonStore extends EntityStore<Reason> {
  constructor() {
    super({ name: 'reason', cache: 450_000 });
  }
}
