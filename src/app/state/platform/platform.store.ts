import { Injectable } from '@angular/core';
import { Platform } from '../../model/platform';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class PlatformStore extends EntityStore<Platform> {
  constructor() {
    super({ name: 'platform', cache: 900_000 });
  }
}
