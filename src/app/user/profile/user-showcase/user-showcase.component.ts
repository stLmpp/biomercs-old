import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ScoreTableType } from '../../../model/score';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlatformQuery } from '../../../state/platform/platform.query';
import { User } from '../../../model/user';
import { ScoreTableParamsForm } from '../../../score/table/control-panel/table-control-panel.component';
import { UserService } from '../../../state/user/user.service';
import { RouteParamEnum } from '../../../model/route-param.enum';
import { filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RouterQuery } from '@stlmpp/router';
import { UserShowcaseService } from '../../../state/user/user-showcase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchHttpError } from '../../../util/operators/catchError';

@Component({
  selector: 'app-user-showcase',
  templateUrl: './user-showcase.component.html',
  styleUrls: ['./user-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserShowcaseComponent implements OnInit, OnDestroy {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public platformQuery: PlatformQuery,
    private userService: UserService,
    private routerQuery: RouterQuery,
    private userShowcaseService: UserShowcaseService,
    private matSnackBar: MatSnackBar
  ) {}

  private _destroy$ = new Subject();

  @Input() user: User;
  @Input() isSameAsLogged: boolean;

  scoreTableType = ScoreTableType;

  loading$ = new BehaviorSubject<boolean>(false);

  executeWhen: (params: ScoreTableParamsForm) => boolean = ({
    idPlayer,
    idType,
    idPlatform,
    idMode,
    idGame,
  }) => {
    this.userService.updateStore(this.user.id, {
      userShowcase: { idType, idPlatform, idGame, idMode },
    });
    return !!(idPlayer && idType && idPlatform && idMode && idGame);
  };

  onLoading(loading: boolean): void {
    this.loading$.next(loading);
    this.changeDetectorRef.detectChanges();
  }

  saveShowcase(): void {
    const showcase = this.user.userShowcase;
    if (!showcase?.idType || !showcase?.idGame || !showcase?.idMode || !showcase?.idPlatform) {
      return;
    }
    this.loading$.next(true);
    const { idPlatform, idMode, idGame, idType } = showcase;
    this.userShowcaseService
      .update(this.user.id, showcase.id, { idGame, idMode, idPlatform, idType })
      .pipe(
        tap(() => {
          this.matSnackBar.open('User showcase updated', 'Close');
        }),
        finalize(() => {
          this.loading$.next(false);
        }),
        catchHttpError(err => {
          this.matSnackBar.open(err.message ?? 'Erro interno', 'Close');
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.routerQuery
      .selectParams<string>(RouteParamEnum.idUser)
      .pipe(
        takeUntil(this._destroy$),
        filter(idUser => !!idUser),
        map(Number),
        switchMap(idUser => {
          this.loading$.next(true);
          return this.userShowcaseService.findByIdUser(idUser).pipe(
            finalize(() => {
              this.loading$.next(false);
            })
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
