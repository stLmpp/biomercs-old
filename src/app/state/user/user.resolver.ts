import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { UserService } from './user.service';
import { RouteParamEnum } from '../../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class SingleUserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<User> | Promise<User> | User {
    return this.userService.findById(+route.params[RouteParamEnum.idUser]);
  }
}
