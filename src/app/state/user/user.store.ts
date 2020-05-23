import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import { EntityStore } from 'st-store';
import { AuthStore } from '../../auth/state/auth.store';

@Injectable({ providedIn: 'root' })
export class UserStore extends EntityStore<User> {
  constructor(private authStore: AuthStore) {
    super({ name: 'user' });
  }

  preAdd(entity: User): User {
    if (entity.id === this.authStore.getState()?.user?.id) {
      this.authStore.update({ user: entity });
    }
    return super.preAdd(entity);
  }

  preUpdate(entity: User): User {
    if (entity.id === this.authStore.getState()?.user?.id) {
      this.authStore.update({ user: entity });
    }
    return super.preUpdate(entity);
  }
}
