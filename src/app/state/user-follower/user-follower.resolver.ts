import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserFollower } from '../../model/user-follower';
import { UserFollowerService } from './user-follower.service';
import { RouteParamEnum } from '../../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class UserFollowerResolver implements Resolve<UserFollower[]> {
  constructor(private userFollowerService: UserFollowerService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserFollower[]> | Promise<UserFollower[]> | UserFollower[] {
    const idFollowed = +route.params[RouteParamEnum.idUser];
    return this.userFollowerService.findByParams({ idFollowed });
  }
}

@Injectable({ providedIn: 'root' })
export class UserFollowedResolver implements Resolve<UserFollower[]> {
  constructor(private userFollowerService: UserFollowerService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserFollower[]> | Promise<UserFollower[]> | UserFollower[] {
    const idFollower = +route.params[RouteParamEnum.idUser];
    return this.userFollowerService.findByParams({ idFollower });
  }
}
