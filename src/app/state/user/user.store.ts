import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import { EntityStore } from '@stlmpp/store';
import { AuthStore } from '../../auth/state/auth.store';
import { UserFollowerStore } from '../user-follower/user-follower.store';
import { UserFollower } from '../../model/user-follower';
import { UserLinkStore } from '../user-link/user-link.store';
import { UserLink } from '../../model/user-link';
import { RegionStore } from '../region/region.store';

@Injectable({ providedIn: 'root' })
export class UserStore extends EntityStore<User> {
  constructor(
    private authStore: AuthStore,
    private userFollowerStore: UserFollowerStore,
    private userLinkStore: UserLinkStore,
    private regionStore: RegionStore
  ) {
    super({
      name: 'user',
      children: [
        {
          key: 'userFollowers',
          store: userFollowerStore,
          relation: (relation: UserFollower) => relation.idFollowed,
          reverseRelation: entity => entity.id,
          isArray: true,
        },
        {
          key: 'userFollowed',
          store: userFollowerStore,
          relation: (relation: UserFollower) => relation.idFollower,
          reverseRelation: entity => entity.id,
          isArray: true,
        },
        {
          key: 'userLinks',
          store: userLinkStore,
          relation: (relation: UserLink) => relation.idUser,
          reverseRelation: entity => entity.id,
          isArray: true,
        },
        {
          key: 'region',
          store: regionStore,
          reverseRelation: user => user.idRegion,
          isArray: false,
        },
      ],
    });
  }

  preAdd(user: User): User {
    if (user.id === this.authStore.getState()?.user?.id) {
      this.authStore.update({ user });
    }
    return super.preAdd(user);
  }

  preUpdate(user: User): User {
    if (user.id === this.authStore.getState()?.user?.id) {
      this.authStore.update({ user });
    }
    return super.preUpdate(user);
  }
}
