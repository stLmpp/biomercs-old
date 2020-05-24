import { Injectable } from '@angular/core';
import { UserFollowerStore } from './user-follower.store';
import { EntityQuery } from '@stlmpp/store';
import { UserFollower } from '../../model/user-follower';

@Injectable({ providedIn: 'root' })
export class UserFollowerQuery extends EntityQuery<UserFollower> {
  constructor(protected store: UserFollowerStore) {
    super(store);
  }
}
