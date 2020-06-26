import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ScoreService } from '../state/score/score.service';
import { Observable } from 'rxjs';
import { ScoreStatusEnum } from '../model/score-status';
import { AuthQuery } from '../auth/state/auth.query';
import { RouteParamEnum } from '../model/route-param.enum';

@Injectable({ providedIn: 'root' })
export class ScoreCountApprovalResolver implements Resolve<number> {
  constructor(private scoreService: ScoreService, private authQuery: AuthQuery) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<number> | Promise<number> | number {
    const user = this.authQuery.getUserSnapshot();
    if (user.id !== +route.paramMap.get(RouteParamEnum.idUser)) {
      return 0;
    }
    return this.scoreService.countApproval({
      idScoreStatus: ScoreStatusEnum.pendingUser,
    });
  }
}
