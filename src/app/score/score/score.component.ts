import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScoreQuery } from '../../state/score/store.query';
import { RouterQuery } from '@stlmpp/router';
import { RouteParamEnum } from '../../model/route-param.enum';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent implements OnInit {
  constructor(
    private scoreQuery: ScoreQuery,
    private routerQuery: RouterQuery
  ) {}

  score$ = this.routerQuery.selectParams(RouteParamEnum.idScore).pipe(
    filter(idScore => !!idScore),
    distinctUntilChanged(),
    switchMap(idScore => this.scoreQuery.selectEntity(idScore))
  );

  ngOnInit(): void {}
}
