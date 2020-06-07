import { Injectable } from '@angular/core';
import { RoleStore } from './role.store';
import { EntityQuery } from '@stlmpp/store';
import { Role } from '../../model/role';

@Injectable({ providedIn: 'root' })
export class RoleQuery extends EntityQuery<Role> {
  constructor(private roleStore: RoleStore) {
    super(roleStore);
  }
}
