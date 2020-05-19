import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserLinkStore, UserLinkState } from './user-link.store';

@Injectable({ providedIn: 'root' })
export class UserLinkQuery extends QueryEntity<UserLinkState> {

  constructor(protected store: UserLinkStore) {
    super(store);
  }

}
