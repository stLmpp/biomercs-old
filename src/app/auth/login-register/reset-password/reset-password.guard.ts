import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../state/auth.service';
import { RouteParamEnum } from '../../../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class ResetPasswordGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idUser = +route.paramMap.get(RouteParamEnum.idUser);
    const token = route.queryParamMap.get(RouteParamEnum.token);
    if (!idUser || !token) {
      return false;
    }
    return this.authService.confirmForgotPassword(idUser, token);
  }
}
