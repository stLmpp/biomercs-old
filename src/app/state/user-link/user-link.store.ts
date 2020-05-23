import { Injectable } from '@angular/core';
import { UserLink } from '../../model/user-link';
import { UserStore } from '../user/user.store';
import { EntityStore } from 'st-store';
import { arrayRemove, arrayUpsert } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class UserLinkStore extends EntityStore<UserLink> {
  constructor(private userStore: UserStore) {
    super({ name: 'user-link' });
  }

  private updateUser(entity: UserLink): void {
    this.userStore.update(entity.idUser, user => ({
      ...user,
      userLinks: arrayUpsert(user.userLinks, entity.id, entity),
    }));
  }

  preAdd(entity: UserLink): UserLink {
    this.updateUser(entity);
    return entity;
  }

  preUpdate(entity: UserLink): UserLink {
    this.updateUser(entity);
    return super.preUpdate(entity);
  }

  postRemove(entitiesRemoved: UserLink[]): void {
    for (const entity of entitiesRemoved) {
      this.userStore.update(entity.idUser, user => ({
        ...user,
        userLinks: arrayRemove(user.userLinks, entity.id),
      }));
    }
    return super.postRemove(entitiesRemoved);
  }
}
