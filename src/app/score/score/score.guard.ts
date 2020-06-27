import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ScoreService } from '../../state/score/score.service';
import { RouteParamEnum } from '../../model/route-param.enum';

@Injectable({
  providedIn: 'root',
})
export class ScoreGuard implements CanActivate {
  constructor(private scoreService: ScoreService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idScore = next.paramMap.get(RouteParamEnum.idScore);
    return !!idScore && this.scoreService.canActivate(+idScore);
  }
}
