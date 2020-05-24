import { Injectable } from '@angular/core';
import { Site } from '../../model/site';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class SiteStore extends EntityStore<Site> {
  constructor() {
    super({ name: 'site', cache: 900_000 });
  }
}
