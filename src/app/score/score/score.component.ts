import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScoreQuery } from '../../state/score/store.query';
import { RouterQuery } from '@stlmpp/router';
import { RouteParamEnum } from '../../model/route-param.enum';
import { distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { TypeEnum } from '../../model/type';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent implements OnInit {
  constructor(private scoreQuery: ScoreQuery, private routerQuery: RouterQuery) {}

  typeEnum = TypeEnum;

  score$ = this.routerQuery.selectParams(RouteParamEnum.idScore).pipe(
    filter(idScore => !!idScore),
    distinctUntilChanged(),
    switchMap(idScore => this.scoreQuery.selectEntity(idScore)),
    shareReplay()
  );

  charactersWrs$ = this.score$.pipe(
    filter(score => !!score),
    map(score =>
      [
        ...new Set(
          score.characterWorldRecords
            .filter(cwr => !!score.isCharacterWorldRecord[cwr.scorePlayers[0].idCharacter])
            .map(cwr => cwr.scorePlayers[0].character.name)
        ),
      ].join(' and ')
    )
  );

  ngOnInit(): void {}
}
