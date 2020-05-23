import { Injectable } from '@angular/core';
import { UserFollower } from '../../model/user-follower';
import { UserStore } from '../user/user.store';
import { EntityStore } from 'st-store';
import { arrayRemove, arrayUpsert } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class UserFollowerStore extends EntityStore<UserFollower> {
  constructor(private userStore: UserStore) {
    super({ name: 'user-follower' });
  }

  private updateUser(entity: UserFollower): void {
    this.userStore.update(entity.idFollower, user => ({
      ...user,
      userFollowed: arrayUpsert(user?.userFollowed ?? [], entity.id, entity),
    }));
    this.userStore.update(entity.idFollowed, user => ({
      ...user,
      userFollowers: arrayUpsert(user?.userFollowers ?? [], entity.id, entity),
    }));
  }

  preAdd(entity: UserFollower): UserFollower {
    this.updateUser(entity);
    return super.preAdd(entity);
  }

  preUpdate(entity: UserFollower): UserFollower {
    this.updateUser(entity);
    return super.preUpdate(entity);
  }

  postRemove(entitiesRemoved: UserFollower[]): void {
    for (const entity of entitiesRemoved) {
      this.userStore.update(entity.idFollower, user => ({
        ...user,
        userFollowed: arrayRemove(user?.userFollowed ?? [], entity.id),
      }));
      this.userStore.update(entity.idFollowed, user => ({
        ...user,
        userFollowers: arrayRemove(user?.userFollowers ?? [], entity.id),
      }));
    }
    super.postRemove(entitiesRemoved);
  }
}
