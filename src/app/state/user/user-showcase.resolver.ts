import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserShowcase } from '../../model/user-showcase';
import { UserShowcaseService } from './user-showcase.service';
import { RouteParamEnum } from '../../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class UserShowcaseResolver implements Resolve<UserShowcase> {
  constructor(private userShowcaseService: UserShowcaseService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserShowcase> | Promise<UserShowcase> | UserShowcase {
    return this.userShowcaseService.findByIdUser(+route.paramMap.get(RouteParamEnum.idUser));
  }
}
