import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import {
  UserRole,
  UserRoleAddDto,
  UserRoleParamsDto,
} from '../../model/user-role';
import { HttpClient } from '@angular/common/http';
import { UserRoleStore } from './user-role.store';
import { UserRoleQuery } from './user-role.query';

@Injectable({ providedIn: 'root' })
export class UserRoleService extends SuperService<
  UserRole,
  UserRoleAddDto,
  any,
  any,
  UserRoleParamsDto
> {
  constructor(
    private http: HttpClient,
    private userRoleStore: UserRoleStore,
    private userRoleQuery: UserRoleQuery
  ) {
    super({
      http,
      store: userRoleStore,
      query: userRoleQuery,
      options: { endPoint: 'user-role', excludeMethods: ['findAll'] },
    });
  }
}
