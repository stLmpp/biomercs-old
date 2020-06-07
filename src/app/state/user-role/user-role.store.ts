import { Injectable } from '@angular/core';
import { EntityStore } from '@stlmpp/store';
import { UserRole } from '../../model/user-role';

@Injectable({ providedIn: 'root' })
export class UserRoleStore extends EntityStore<UserRole> {
  constructor() {
    super({ name: 'user-role' });
  }
}
