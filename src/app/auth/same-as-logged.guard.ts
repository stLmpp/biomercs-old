import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './state/auth.query';
import { map } from 'rxjs/operators';
import { RouteParamEnum } from '../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class SameAsLoggedGuard implements CanActivate {
  constructor(private authQuery: AuthQuery, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authQuery.user$.pipe(
      map(user => {
        return user.id === +next.paramMap.get(RouteParamEnum.idUser) || this.router.createUrlTree(['/']);
      })
    );
  }
}
