import { Injectable } from '@angular/core';
import { UserLinkStore } from './user-link.store';
import { EntityQuery } from '@stlmpp/store';
import { UserLink } from '../../model/user-link';

@Injectable({ providedIn: 'root' })
export class UserLinkQuery extends EntityQuery<UserLink> {
  constructor(protected store: UserLinkStore) {
    super(store);
  }
}
