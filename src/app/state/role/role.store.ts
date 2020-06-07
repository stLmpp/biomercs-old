import { Injectable } from '@angular/core';
import { EntityStore } from '@stlmpp/store';
import { Role } from '../../model/role';

@Injectable({ providedIn: 'root' })
export class RoleStore extends EntityStore<Role> {
  constructor() {
    super({ name: 'role', cache: 9_000_000 });
  }
}
