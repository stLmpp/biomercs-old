import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { Score, ScoreApprovalParamsDto } from '../../model/score';
import { ScoreStatusEnum } from '../../model/score-status';
import { isEmpty, OrderByDirection, ToControls } from '../../util/util';
import { ScoreParameters } from '../score-parameters.super';
import { GameService } from '../../state/game/game.service';
import { ModeService } from '../../state/mode/mode.service';
import { TypeService } from '../../state/type/type.service';
import { PlatformQuery } from '../../state/platform/platform.query';
import { CharacterService } from '../../state/character/character.service';
import { StageService } from '../../state/stage/stage.service';
import { ScoreService } from '../../state/score/score.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { PaginationMeta } from '../../model/pagination';
import { Sort } from '@angular/material/sort';
import { RouterQuery } from '@stlmpp/router';
import { trackByPlatform } from '../../model/platform';
import { trackByGame } from '../../model/game';
import { trackByMode } from '../../model/mode';
import { trackByType, TypeEnum } from '../../model/type';
import { trackByUser, User } from '../../model/user';
import { AuthQuery } from '../../auth/state/auth.query';
import { UserService } from '../../state/user/user.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ScoreApprovalTableSelectionChangeEvent } from './score-approval-table/score-approval-table.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../shared/dialog/dialog.service';
import { ScoreApprovalService } from '../../state/score-approval/score-approval.service';
import {
  ScoreApprovalAddDto,
  ScoreApprovalAddManyDto,
  ScoreApprovalStatusEnum,
  ScoreApprovalTypeEnum,
} from '../../model/score-approval';
import { I18nPluralPipe } from '@angular/common';
import {
  RejectionMotive,
  ScoreRejectionMotiveComponent,
} from './score-rejection-motive/score-rejection-motive.component';
import { trackByStage } from '../../model/stage';
import { trackByCharacter } from '../../model/character';
import {
  ScoreApprovalFillComponent,
  ScoreApprovalFillData,
} from './score-approval-fill/score-approval-fill.component';

interface ScoreApprovalParamsForm extends ToControls<ScoreApprovalParamsDto> {
  page: number;
  orderBy: string;
  orderByDirection: OrderByDirection;
}

@Component({
  selector: 'app-score-approval',
  templateUrl: './score-approval.component.html',
  styleUrls: ['./score-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [I18nPluralPipe],
})
export class ScoreApprovalComponent extends ScoreParameters<ScoreApprovalParamsForm>
  implements OnInit, AfterViewInit {
  constructor(
    public platformQuery: PlatformQuery,
    private gameService: GameService,
    private modeService: ModeService,
    private typeService: TypeService,
    private characterService: CharacterService,
    private stageService: StageService,
    private scoreService: ScoreService,
    private routerQuery: RouterQuery,
    private changeDetectorRef: ChangeDetectorRef,
    private authQuery: AuthQuery,
    private userService: UserService,
    private matDialog: MatDialog,
    private dialogService: DialogService,
    private scoreApprovalService: ScoreApprovalService,
    private i18nPluralPipe: I18nPluralPipe
  ) {
    super(gameService, modeService, typeService, stageService, characterService);
    this.init();
  }

  @Input() userMode: boolean;

  scoreStatusEnum = ScoreStatusEnum;

  form = new FormGroup<ScoreApprovalParamsForm>({
    idScoreStatus: new FormControl(ScoreStatusEnum.pendingAdmin, [Validators.required]),
    idPlatform: new FormControl(1),
    idGame: new FormControl(1),
    idMode: new FormControl(1),
    idType: new FormControl(1),
    idStage: new FormControl(),
    idCharacter: new FormControl(),
    idPlayer: new FormControl(null, { updateOn: 'blur' }),
    endDate: new FormControl(null, { updateOn: 'blur' }),
    startDate: new FormControl(null, { updateOn: 'blur' }),
    page: new FormControl(0),
    orderBy: new FormControl('score.id'),
    orderByDirection: new FormControl('ASC'),
  });

  usernameControl = new FormControl<string>();

  get startDateControl(): FormControl<Date> {
    return this.form.get('startDate');
  }

  get endDateControl(): FormControl<Date> {
    return this.form.get('endDate');
  }

  get idPlayerControl(): FormControl<number> {
    return this.form.get('idPlayer');
  }

  get idScoreStatusControl(): FormControl<number> {
    return this.form.get('idScoreStatus');
  }

  loadingData = false;

  private refreshData$ = new BehaviorSubject<number>(0);

  private scoreData$ = combineLatest([this.form.valueChanges, this.refreshData$.asObservable()]).pipe(
    debounceTime(50),
    distinctUntilChanged(([paramsA, refreshA], [paramsB, refreshB]) => {
      if (!refreshB || refreshA === refreshB) {
        return isEqual(paramsA, paramsB);
      }
      return false;
    }),
    pluck(0),
    tap(() => {
      this.loadingData = true;
      this.changeDetectorRef.markForCheck();
    }),
    debounceTime(300),
    map(params => ({ ...params, page: params.page + 1 })),
    map(params => {
      if (params.endDate) {
        params.endDate.setHours(23, 59, 59, 999);
      }
      return params;
    }),
    switchMap(params =>
      this.scoreService.findApprovalList(params).pipe(
        finalize(() => {
          this.loadingData = false;
          this.changeDetectorRef.markForCheck();
        })
      )
    ),
    shareReplay()
  );

  meta$: Observable<PaginationMeta> = this.scoreData$.pipe(
    filter(scoreData => !!scoreData),
    pluck('meta')
  );
  scores$: Observable<Score[]> = this.scoreData$.pipe(
    filter(scoreData => !!scoreData),
    pluck('items')
  );

  users$ = this.usernameControl.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    filter(value => !isEmpty(value)),
    switchMap(name => this.userService.search(name, null)),
    shareReplay()
  );

  trackByPlatform = trackByPlatform;
  trackByGame = trackByGame;
  trackByMode = trackByMode;
  trackByType = trackByType;
  trackByUser = trackByUser;
  trackByStage = trackByStage;
  trackByCharacter = trackByCharacter;

  selectedIds: number[] = [];
  selected: Score[] = [];

  displayUser = (user: User): string => user?.username ?? '';

  refreshData(): void {
    this.refreshData$.next(this.refreshData$.value + 1);
  }

  approveAll(): void {
    if (!this.selected.length) {
      return;
    }
    const dto: ScoreApprovalAddManyDto = {
      idScores: this.selected.map(({ id }) => id),
      type: this.userMode ? ScoreApprovalTypeEnum.user : ScoreApprovalTypeEnum.admin,
      status: ScoreApprovalStatusEnum.approved,
    };
    const observable = this.userMode
      ? this.scoreApprovalService.addManyUser(dto)
      : this.scoreApprovalService.addManyAdmin(dto);
    this.dialogService
      .confirm({
        title: `Approve ${this.i18nPluralPipe.transform(this.selected.length, {
          '=1': '# score',
          other: '# scores',
        })}`,
        btnNo: 'Cancel',
        btnYes: 'Approve',
        observable,
      })
      .pipe(filter(confirm => confirm))
      .subscribe(() => {
        this.selected = [];
        this.selectedIds = [];
        this.refreshData();
      });
  }

  rejectAll(): void {
    if (!this.selected.length) {
      return;
    }
    let dto: ScoreApprovalAddManyDto = {
      idScores: this.selected.map(({ id }) => id),
      type: this.userMode ? ScoreApprovalTypeEnum.user : ScoreApprovalTypeEnum.admin,
      status: ScoreApprovalStatusEnum.rejected,
    };
    this.matDialog
      .open<ScoreRejectionMotiveComponent, any, RejectionMotive>(ScoreRejectionMotiveComponent)
      .afterClosed()
      .pipe(
        take(1),
        switchMap(data => {
          if (data) {
            dto = { ...dto, ...data };
            const observable = this.userMode
              ? this.scoreApprovalService.addManyUser(dto)
              : this.scoreApprovalService.addManyAdmin(dto);
            return this.dialogService.confirm({
              title: `Reject ${this.i18nPluralPipe.transform(this.selected.length, {
                '=1': '# score',
                other: '# scores',
              })}`,
              btnYes: 'Reject',
              btnNo: 'Cancel',
              observable,
            });
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe(() => {
        this.selected = [];
        this.selectedIds = [];
        this.refreshData();
      });
  }

  approveOne(score: Score): void {
    const dto: ScoreApprovalAddDto = {
      status: ScoreApprovalStatusEnum.approved,
      type: this.userMode ? ScoreApprovalTypeEnum.user : ScoreApprovalTypeEnum.admin,
      idScore: score.id,
    };
    const observable = this.userMode
      ? this.scoreApprovalService.addUser(dto)
      : this.scoreApprovalService.addAdmin(dto);
    if (this.userMode) {
      this.matDialog
        .open(ScoreApprovalFillComponent, {
          data: { observable, scorePlayer: score.scorePlayers[1] } as ScoreApprovalFillData,
        })
        .afterClosed()
        .pipe(
          take(1),
          filter(approved => approved)
        )
        .subscribe(() => {
          this.refreshData();
        });
    } else {
      this.dialogService
        .confirm({
          btnYes: 'Approve',
          btnNo: 'Cancel',
          title: `Approve score ${score.id}`,
          observable,
        })
        .pipe(filter(confirm => confirm))
        .subscribe(() => {
          this.refreshData();
        });
    }
  }

  rejectOne(score: Score): void {
    let dto: ScoreApprovalAddDto = {
      status: ScoreApprovalStatusEnum.rejected,
      type: this.userMode ? ScoreApprovalTypeEnum.user : ScoreApprovalTypeEnum.admin,
      idScore: score.id,
    };
    this.matDialog
      .open<ScoreRejectionMotiveComponent, any, RejectionMotive>(ScoreRejectionMotiveComponent)
      .afterClosed()
      .pipe(
        take(1),
        switchMap(data => {
          if (data) {
            dto = { ...dto, ...data };
            const observable = this.userMode
              ? this.scoreApprovalService.addUser(dto)
              : this.scoreApprovalService.addAdmin(dto);
            return this.dialogService.confirm({
              title: `Reject score ${score.id}`,
              btnYes: 'Reject',
              btnNo: 'Cancel',
              observable,
            });
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe(() => {
        this.refreshData();
      });
  }

  onSelectionChange({ isSelected, score }: ScoreApprovalTableSelectionChangeEvent): void {
    if (isSelected) {
      this.selected.push(score);
    } else {
      this.selected = this.selected.filter(({ id }) => id !== score.id);
    }
  }

  patchUser(options: MatOptionSelectionChange): void {
    const user: User = options.source.value;
    this.idPlayerControl.setValue(user.id);
  }

  onSortChange({ direction, active }: Sort): void {
    this.form.patchValue({
      orderByDirection: direction.toUpperCase() as OrderByDirection,
      orderBy: active,
    });
  }

  initSub(): void {
    this.checkNextParameter(this.games$, this.idGameControl);
    this.checkNextParameter(this.modes$, this.idModeControl);
    this.checkNextParameter(this.types$, this.idTypeControl);
    this.checkNextParameter(this.stages$, this.idStageControl, true);
    this.checkNextParameter(this.characters$, this.idCharacterControl, true);
  }

  ngOnInit(): void {
    this.initSub();
    if (this.userMode) {
      this.idPlayerControl.setValue(this.authQuery.getUserSnapshot().id);
      this.idTypeControl.setValue(TypeEnum.duo);
      this.idScoreStatusControl.setValue(ScoreStatusEnum.pendingUser);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.enable();
    });
  }
}
