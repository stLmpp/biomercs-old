import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlatformQuery } from '../../state/platform/platform.query';
import { trackByPlatform } from '../../model/platform';
import {
  Control,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorsModel,
} from '@ng-stack/forms';
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
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { GameService } from '../../state/game/game.service';
import { ModeService } from '../../state/mode/mode.service';
import { TypeService } from '../../state/type/type.service';
import { CharacterService } from '../../state/character/character.service';
import { trackByGame } from '../../model/game';
import { trackByMode } from '../../model/mode';
import { trackByType } from '../../model/type';
import { trackByCharacter } from '../../model/character';
import { ScorePlayerAddDto } from '../../model/score-player';
import { AuthQuery } from '../../auth/state/auth.query';
import { TypeQuery } from '../../state/type/type.query';
import { isEmpty, isNil } from '../../util/util';
import { CommonColumns } from '../../model/common-history';
import { StageService } from '../../state/stage/stage.service';
import { trackByFactory } from '@stlmpp/utils';
import { User } from '../../model/user';
import { UserService } from '../../state/user/user.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ScoreService } from '../../state/score/score.service';
import { ScoreIsWrDto, ScoreIsWrViewModel } from '../../model/score';
import { isEqual } from 'underscore';
import { MaskEnum, MaskEnumPatterns } from '../../model/mask.enum';
import { ScorePlayerProofAddDto } from '../../model/score-player-proof';
import { SiteQuery } from '../../state/site/site.query';
import { trackBySite } from '../../model/site';
import { DefaultQuery } from '../../state/default/default.query';
import { catchHttpError } from '../../util/operators/catchError';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';

interface ScorePlayerAddDtoForm extends ScorePlayerAddDto {
  player?: Control<User>;
  scorePlayerProofs?: ScorePlayerProofAddDtoForm[];
}

interface ScorePlayerProofAddDtoForm extends ScorePlayerProofAddDto {
  file?: Control<FileList>;
}

interface SubmitScoreForm {
  idPlatform: number;
  idGame: number;
  idMode: number;
  idType: number;
  idStage: number;
  scorePlayers: ScorePlayerAddDtoForm[];
  score: number;
  maxCombo: number;
  time: string;
}

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    public platformQuery: PlatformQuery,
    private gameService: GameService,
    private modeService: ModeService,
    private typeService: TypeService,
    private characterService: CharacterService,
    private authQuery: AuthQuery,
    private formBuilder: FormBuilder,
    private typeQuery: TypeQuery,
    private changeDetectorRef: ChangeDetectorRef,
    private stageService: StageService,
    private userService: UserService,
    private scoreService: ScoreService,
    public siteQuery: SiteQuery,
    public defaultQuery: DefaultQuery,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  private _destroy$ = new Subject();

  @ViewChild('formRef') formRef: FormGroupDirective;

  maskEnum = MaskEnum;
  maskPatterns = MaskEnumPatterns;

  form = this.initialForm();

  get idPlatformControl(): FormControl<number> {
    return this.form.get('idPlatform');
  }

  get idGameControl(): FormControl<number> {
    return this.form.get('idGame');
  }

  get idModeControl(): FormControl<number> {
    return this.form.get('idMode');
  }

  get idTypeControl(): FormControl<number> {
    return this.form.get('idType');
  }

  get idStageControl(): FormControl<number> {
    return this.form.get('idStage');
  }

  get scorePlayersControl(): FormArray<ScorePlayerAddDtoForm> {
    return this.form.get('scorePlayers');
  }

  games$ = this.valueChanges('idPlatform', true).pipe(
    switchMap(idPlatform => {
      this.idGameControl.disable();
      return this.gameService.findByParams({ idPlatform }).pipe(
        finalize(() => {
          this.idGameControl.enable();
        })
      );
    }),
    shareReplay()
  );
  stages$ = this.valueChanges('idGame', true).pipe(
    switchMap(idGame => {
      this.idStageControl.disable();
      return this.stageService.findByParams({ idGame }).pipe(
        finalize(() => {
          this.idStageControl.enable();
        })
      );
    })
  );
  modes$ = combineLatest([this.valueChanges('idPlatform', true), this.valueChanges('idGame', true)]).pipe(
    switchMap(([idPlatform, idGame]) => {
      this.idModeControl.disable();
      return this.modeService.findByParams({ idGame, idPlatform }).pipe(
        finalize(() => {
          this.idModeControl.enable();
        })
      );
    }),
    shareReplay()
  );
  types$ = combineLatest([this.valueChanges('idGame', true), this.valueChanges('idMode', true)]).pipe(
    switchMap(([idGame, idMode]) => {
      this.idTypeControl.disable();
      return this.typeService.findByParams({ idGame, idMode }).pipe(
        finalize(() => {
          this.idTypeControl.enable();
        })
      );
    }),
    shareReplay()
  );
  characters$ = combineLatest([this.valueChanges('idGame', true), this.valueChanges('idMode', true)]).pipe(
    switchMap(([idGame, idMode]) => this.characterService.findByParams({ idGame, idMode })),
    shareReplay()
  );

  userInput$ = new Subject<string>();

  users$ = this.userInput$.asObservable().pipe(
    distinctUntilChanged(),
    filter(value => !isEmpty(value)),
    debounceTime(400),
    withLatestFrom(this.authQuery.user$),
    switchMap(([name, userLogged]) =>
      this.userService.search(name, null).pipe(map(users => users.filter(user => user.id !== userLogged.id)))
    ),
    shareReplay()
  );

  isWr$: Observable<ScoreIsWrViewModel> = this.form.valueChanges.pipe(
    filter(value => !!value),
    filter(
      ({ idType, idMode, idPlatform, idGame, idStage }) =>
        !!(idType && idMode && idPlatform && idGame && idStage)
    ),
    map(({ scorePlayers, score, idGame, idStage, idPlatform, idType, idMode }) => {
      const type = this.typeQuery.getEntity(idType);
      return {
        idCharacters: scorePlayers
          .filter((_, index) => index + 1 <= type.playerQuantity)
          .map(player => player.idCharacter),
        score,
        idGame,
        idStage,
        idPlatform,
        idType,
        idMode,
      };
    }),
    distinctUntilChanged<ScoreIsWrDto>(isEqual),
    switchMap(dto => {
      if (!dto.score) {
        return of({});
      } else {
        return this.scoreService.isWr(dto);
      }
    }),
    shareReplay()
  );

  charactersWrs$ = this.isWr$.pipe(
    filter(score => !!score),
    filter(score => !isEmpty(score)),
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

  trackByPlatform = trackByPlatform;
  trackByGame = trackByGame;
  trackByMode = trackByMode;
  trackByType = trackByType;
  trackByCharacter = trackByCharacter;
  trackByScorePlayerControl = trackByFactory<FormGroup<ScorePlayerAddDtoForm, ValidatorsModel>>();
  trackByScorePlayerProofControl = trackByFactory<FormGroup<ScorePlayerProofAddDtoForm, ValidatorsModel>>();
  trackBySite = trackBySite;

  displayUser = (user: User): string => user?.username ?? '';

  resetForm(): void {
    this.form.reset({
      ...this.form.getRawValue(),
      score: null,
      maxCombo: null,
      time: null,
      scorePlayers: [
        {
          ...this.form.get('scorePlayers').getRawValue()[0],
          bulletKills: null,
          host: true,
          description: null,
          scorePlayerProofs: [
            {
              idSite: null,
              url: null,
            },
            {
              file: null,
            },
          ],
        },
      ],
    });
    this.formRef.resetForm(this.form.getRawValue());
  }

  private initialForm(): FormGroup<SubmitScoreForm> {
    return this.formBuilder.group<SubmitScoreForm>({
      idPlatform: [this.platformQuery.getAll()[0].id, [Validators.required]],
      idGame: [null, [Validators.required]],
      idMode: [null, [Validators.required]],
      idType: [null, [Validators.required]],
      idStage: [null, [Validators.required]],
      score: [null, { validators: [Validators.required], updateOn: 'blur' }],
      maxCombo: [null, [Validators.required]],
      time: null,
      scorePlayers: this.formBuilder.array([
        this.formBuilder.group<ScorePlayerAddDtoForm>({
          idPlayer: [this.authQuery.getUserSnapshot().id, [Validators.required]],
          idCharacter: this.formBuilder.control<number>(null, [Validators.required]),
          bulletKills: this.formBuilder.control<number>(null),
          host: this.formBuilder.control<boolean>(true),
          player: this.formBuilder.control<User>(this.authQuery.getUserSnapshot(), [Validators.required]),
          description: this.formBuilder.control<string>(null),
          scorePlayerProofs: this.scorePlayerProofArray(),
        }),
      ]),
    });
  }

  private addPlayer(user?: User): void {
    this.scorePlayersControl.push(
      this.formBuilder.group<ScorePlayerAddDtoForm>({
        idPlayer: [user?.id, [Validators.required]],
        idCharacter: [null, [Validators.required]],
        bulletKills: null,
        host: this.formBuilder.control<boolean>(false),
        player: [user, [Validators.required]],
        description: null,
        scorePlayerProofs: this.scorePlayerProofArray(),
      })
    );
    this.checkNextParameter(
      this.characters$,
      this.scorePlayersControl.at(this.scorePlayersControl.length - 1).get('idCharacter')
    );
  }

  private scorePlayerProofArray(): FormArray<ScorePlayerProofAddDtoForm> {
    return this.formBuilder.array<ScorePlayerProofAddDtoForm>([
      this.formBuilder.group<ScorePlayerProofAddDtoForm>({
        url: this.formBuilder.control(null),
        idSite: this.formBuilder.control(null),
      }),
      this.formBuilder.group<ScorePlayerProofAddDtoForm>({
        file: this.formBuilder.control(null),
      }),
    ]);
  }

  patchUser(index: number, options: MatOptionSelectionChange): void {
    const user: User = options.source.value;
    this.form
      .get('scorePlayers')
      .at(index)
      .get('idPlayer')
      .setValue(user.id);
  }

  changeHost(index: number): void {
    this.scorePlayersControl.controls
      .filter((_, i) => i !== index)
      .forEach(control => {
        control.patchValue({ host: false });
      });
  }

  onSubmit(): void {
    const dto = this.form.getRawValue();
    dto.scorePlayers = dto.scorePlayers.map(player => {
      player.scorePlayerProofs = player.scorePlayerProofs.filter(
        proof => proof.file?.length || (proof.idSite && proof.url)
      );
      return player;
    });
    this.form.disable();
    this.scoreService
      .add(dto)
      .pipe(
        finalize(() => {
          this.form.enable();
        }),
        catchHttpError(err => {
          this.matSnackBar.open(err.message, 'Close');
        }),
        tap(score => {
          this.matSnackBar
            .open('Score submitted successfully', 'See score')
            .onAction()
            .pipe(take(1))
            .subscribe(() => {
              this.router.navigate(['../', score.id], { relativeTo: this.activatedRoute });
            });
          this.resetForm();
          this.form
            .get('scorePlayers')
            .controls[0].get('player')
            .disable();
        })
      )
      .subscribe();
  }

  private valueChanges<K extends keyof SubmitScoreForm>(
    key: K,
    filterNil?: boolean
  ): Observable<SubmitScoreForm[K]> {
    let values$ = (this.form.get(key).valueChanges as Observable<SubmitScoreForm[K]>).pipe(
      takeUntil(this._destroy$),
      distinctUntilChanged()
    );
    if (filterNil) {
      values$ = values$.pipe(filter(value => !isNil(value)));
    }
    return values$;
  }

  private checkNextParameter<T extends CommonColumns>(
    observable: Observable<T[]>,
    checkControl: FormControl<number>
  ): void {
    observable
      .pipe(
        takeUntil(this._destroy$),
        filter(values => !!values.length),
        filter(values => !values.some(value => value.id === checkControl.value)),
        map(([value]) => value),
        pluck('id')
      )
      .subscribe(id => {
        checkControl.setValue(id);
      });
  }

  private initSub(): void {
    this.checkNextParameter(this.games$, this.idGameControl);
    this.checkNextParameter(this.modes$, this.idModeControl);
    this.checkNextParameter(this.types$, this.idTypeControl);
    this.checkNextParameter(this.stages$, this.idStageControl);
    for (const scorePlayer of this.scorePlayersControl.controls) {
      this.checkNextParameter(this.characters$, scorePlayer.get('idCharacter'));
    }
    this.valueChanges('idType').subscribe(idType => {
      if (idType) {
        const type = this.typeQuery.getEntity(idType);
        if (type.playerQuantity > this.scorePlayersControl.length) {
          for (const _ of Array.from({ length: type.playerQuantity - this.scorePlayersControl.length })) {
            this.addPlayer();
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.initSub();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.enable();
      this.form
        .get('scorePlayers')
        .controls[0].get('player')
        .disable();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}