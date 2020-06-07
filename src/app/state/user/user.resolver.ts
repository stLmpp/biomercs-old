import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { UserService } from './user.service';
import { RouteParamEnum } from '../../model/route-param.enum';
import { Like } from '../../model/like';
import { LikeService } from '../like/like.service';
import { ReferenceTypeEnum } from '../../model/reference-type.enum';
import { AuthQuery } from '../../auth/state/auth.query';

@Injectable({ providedIn: 'root' })
export class SingleUserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {
    return this.userService.findById(+route.paramMap.get(RouteParamEnum.idUser));
  }
}

@Injectable({ providedIn: 'root' })
export class UserLikeResolver implements Resolve<Like> {
  constructor(private likeService: LikeService, private authQuery: AuthQuery) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Like> | Promise<Like> | Like {
    return this.likeService.findOneByParams({
      idReference: +route.paramMap.get(RouteParamEnum.idUser),
      type: ReferenceTypeEnum.user,
      createdBy: this.authQuery.getUserSnapshot().id,
    });
  }
}
