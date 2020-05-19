import { Injectable } from '@angular/core';
import {
  arrayAdd,
  EntityState,
  EntityStore,
  getEntityType,
  StoreConfig,
} from '@datorama/akita';
import { UserLink } from '../../model/user-link';
import { UserStore } from '../user/user.store';

export interface UserLinkState extends EntityState<UserLink> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-link' })
export class UserLinkStore extends EntityStore<UserLinkState> {
  constructor(private userStore: UserStore) {
    super();
    this.akitaPreAddEntity = this.akitaPreAddEntity.bind(this);
  }

  akitaPreAddEntity(newEntity: any): getEntityType<UserLinkState> {
    const userLink = super.akitaPreAddEntity(newEntity);
    this.userStore.update(userLink.idUser, user => ({
      ...user,
      userLinks: arrayAdd(user.userLinks, userLink),
    }));
    return userLink;
  }
}
