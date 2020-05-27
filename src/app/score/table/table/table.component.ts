import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ScoreTable,
  ScoreTableParamsDto,
  ScoreTableType,
} from '../../../model/score';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { ScoreService } from '../../../state/score/score.service';
import { isEqual } from 'underscore';
import { isNil } from '../../../util/util';
import { TypeEnum } from '../../../model/type';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  constructor(private scoreService: ScoreService) {}

  private params$ = new BehaviorSubject<ScoreTableParamsDto>(null);

  @Input()
  set params(params: ScoreTableParamsDto) {
    this.params$.next(params);
    this._params = params;
  }
  _params: ScoreTableParamsDto;

  scoreTableType = ScoreTableType;

  typeEnum = TypeEnum;

  scores$ = this.params$.pipe(
    filter(params => !!params),
    filter(
      ({ idType, idPlatform, idMode, idGame, type }) =>
        !isNil(idType && idPlatform && idMode && idGame && type)
    ),
    distinctUntilChanged(isEqual),
    switchMap(
      ({
        type,
        idCharacter,
        idGame,
        idMode,
        idPlatform,
        idPlayer,
        idType,
        limit,
      }) => {
        this.loading.emit(true);
        let http: Observable<ScoreTable[][]>;
        if (type === ScoreTableType.character) {
          http = this.scoreService.getTableScorePlayer(
            idGame,
            idMode,
            idPlatform,
            idType,
            idPlayer
          );
        } else {
          http = this.scoreService.getManyTopScore(
            idPlatform,
            idGame,
            idMode,
            idType,
            limit,
            idCharacter,
            idPlayer
          );
        }
        return http.pipe(
          finalize(() => {
            this.loading.emit(false);
          })
        );
      }
    ),
    shareReplay()
  );

  columns$: Observable<string[]> = this.scores$.pipe(
    filter(table => !!table),
    map(scoreTable => {
      const columns = scoreTable[0].map(o => o.stage.name);
      if (this._params.type === ScoreTableType.character) {
        columns.unshift('Char');
        columns.push('Total');
        return columns;
      } else {
        columns.unshift('Player');
        columns.unshift('#');
        columns.push('Total');
        return columns;
      }
    })
  );

  @Output() loading = new EventEmitter<boolean>();

  ngOnInit(): void {}
}
