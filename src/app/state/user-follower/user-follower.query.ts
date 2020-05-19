import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserFollowerStore, UserFollowerState } from './user-follower.store';

@Injectable({ providedIn: 'root' })
export class UserFollowerQuery extends QueryEntity<UserFollowerState> {
  constructor(protected store: UserFollowerStore) {
    super(store);
  }
}
