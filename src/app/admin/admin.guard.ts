import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  UrlSegment,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from '../auth/state/auth.query';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private authQuery: AuthQuery) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authQuery.isAdmin$;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authQuery.isAdmin$;
  }
}
