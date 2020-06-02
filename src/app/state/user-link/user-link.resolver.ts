import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserLink } from '../../model/user-link';
import { UserLinkService } from './user-link.service';
import { RouteParamEnum } from '../../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class UserLinkResolver implements Resolve<UserLink[]> {
  constructor(private userLinkService: UserLinkService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserLink[]> | Promise<UserLink[]> | UserLink[] {
    return this.userLinkService.findByParams({
      idUser: +route.paramMap.get(RouteParamEnum.idUser),
    });
  }
}
