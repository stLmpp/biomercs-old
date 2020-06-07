import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../../model/role';
import { RoleService } from './role.service';

@Injectable({ providedIn: 'root' })
export class RoleResolver implements Resolve<Role[]> {
  constructor(private roleService: RoleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Role[]> | Promise<Role[]> | Role[] {
    return this.roleService.findAll();
  }
}
