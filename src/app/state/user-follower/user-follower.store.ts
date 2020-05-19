import { Injectable } from '@angular/core';
import {
  arrayUpsert,
  EntityState,
  EntityStore,
  getEntityType,
  StoreConfig,
} from '@datorama/akita';
import { UserFollower } from '../../model/user-follower';
import { UserStore } from '../user/user.store';

export interface UserFollowerState extends EntityState<UserFollower> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-follower' })
export class UserFollowerStore extends EntityStore<UserFollowerState> {
  constructor(private userStore: UserStore) {
    super();
    this.akitaPreAddEntity = this.akitaPreAddEntity.bind(this);
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

  akitaPreAddEntity(newEntity: any): getEntityType<UserFollowerState> {
    const entity = super.akitaPreAddEntity(newEntity);
    this.updateUser(entity);
    return entity;
  }

  akitaPreUpdateEntity(
    _: Readonly<getEntityType<UserFollowerState>>,
    nextEntity: any
  ): getEntityType<UserFollowerState> {
    const entity = super.akitaPreUpdateEntity(_, nextEntity);
    this.updateUser(entity);
    return entity;
  }

  akitaPreCheckEntity(
    newEntity: Readonly<getEntityType<UserFollowerState>>
  ): getEntityType<UserFollowerState> {
    return super.akitaPreCheckEntity(newEntity);
  }
}
