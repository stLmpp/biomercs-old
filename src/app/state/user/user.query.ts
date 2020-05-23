import { Injectable } from '@angular/core';
import { UserStore } from './user.store';
import { User } from '../../model/user';
import { EntityQuery } from 'st-store';

@Injectable({ providedIn: 'root' })
export class UserQuery extends EntityQuery<User> {
  constructor(protected store: UserStore) {
    super(store);
  }
}
