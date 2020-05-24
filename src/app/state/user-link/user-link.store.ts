import { Injectable } from '@angular/core';
import { UserLink } from '../../model/user-link';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class UserLinkStore extends EntityStore<UserLink> {
  constructor() {
    super({ name: 'user-link' });
  }
}
