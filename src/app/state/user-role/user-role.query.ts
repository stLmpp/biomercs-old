import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { UserRole } from '../../model/user-role';
import { UserRoleStore } from './user-role.store';

@Injectable({ providedIn: 'root' })
export class UserRoleQuery extends EntityQuery<UserRole> {
  constructor(private userRoleStore: UserRoleStore) {
    super(userRoleStore);
  }
}
