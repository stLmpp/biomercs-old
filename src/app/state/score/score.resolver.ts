import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Score } from '../../model/score';
import { Observable } from 'rxjs';
import { ScoreService } from './score.service';
import { RouteParamEnum } from '../../model/route-param.enum';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SingleScoreResolver implements Resolve<Score> {
  constructor(private scoreService: ScoreService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Score> | Promise<Score> | Score {
    return this.scoreService.findById(
      +route.paramMap.get(RouteParamEnum.idScore)
    );
  }
}

@Injectable({ providedIn: 'root' })
export class RandomScoreResolver implements Resolve<number> {
  constructor(private scoreService: ScoreService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<number> | Promise<number> | number {
    const dto = route.queryParamMap.keys.reduce(
      (acc, key) => ({ ...acc, [key]: route.queryParamMap.get(key) }),
      {}
    );
    return this.scoreService.findRandom(dto).pipe(
      tap(idScore => {
        this.router.navigate(['/score', idScore]);
      })
    );
  }
}
