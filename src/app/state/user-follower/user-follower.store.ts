import { Injectable } from '@angular/core';
import { UserFollower } from '../../model/user-follower';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class UserFollowerStore extends EntityStore<UserFollower> {
  constructor() {
    super({ name: 'user-follower' });
  }
}
