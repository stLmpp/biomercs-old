import { Injectable } from '@angular/core';
import { Mode } from '../../model/mode';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class ModeStore extends EntityStore<Mode> {
  constructor() {
    super({ name: 'mode', cache: 900_000 });
  }
}
