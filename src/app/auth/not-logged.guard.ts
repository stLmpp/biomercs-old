import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './state/auth.query';

@Injectable({
  providedIn: 'root',
})
export class NotLoggedGuard implements CanActivate {
  constructor(private authQuery: AuthQuery) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return !this.authQuery.isLogged();
  }
}
