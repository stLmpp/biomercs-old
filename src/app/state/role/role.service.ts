import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import {
  Role,
  RoleAddDto,
  RoleExistsDto,
  RoleUpdateDto,
} from '../../model/role';
import { HttpClient } from '@angular/common/http';
import { RoleStore } from './role.store';
import { RoleQuery } from './role.query';

@Injectable({ providedIn: 'root' })
export class RoleService extends SuperService<
  Role,
  RoleAddDto,
  RoleUpdateDto,
  RoleExistsDto
> {
  constructor(
    private http: HttpClient,
    private roleStore: RoleStore,
    private roleQuery: RoleQuery
  ) {
    super({
      http,
      store: roleStore,
      query: roleQuery,
      options: { endPoint: 'role' },
    });
  }
}
