import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlatformQuery } from '../../state/platform/platform.query';
import { trackByPlatform } from '../../model/platform';
import { Control, FormArray, FormBuilder, FormGroup, Validators, ValidatorsModel } from '@ng-stack/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
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
import { ScorePlayerAddDto } from '../../model/score-player';
import { AuthQuery } from '../../auth/state/auth.query';
import { TypeQuery } from '../../state/type/type.query';
import { isEmpty } from '../../util/util';
import { StageService } from '../../state/stage/stage.service';
import { trackByFactory } from '@stlmpp/utils';
import { trackByUser, User } from '../../model/user';
import { UserService } from '../../state/user/user.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ScoreService } from '../../state/score/score.service';
import { ScoreAverageDto, ScoreIsWrDto, ScoreIsWrViewModel } from '../../model/score';
import { isEqual } from 'lodash';
import { MaskEnum, MaskEnumPatterns } from '../../model/mask.enum';
import { ScorePlayerProofAddDto } from '../../model/score-player-proof';
import { SiteQuery } from '../../state/site/site.query';
import { trackBySite } from '../../model/site';
import { DefaultQuery } from '../../state/default/default.query';
import { catchHttpError } from '../../util/operators/catchError';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';
import { GameModeStageService } from '../../state/game-mode-stage/game-mode-stage.service';
import { ScoreParameters } from '../score-parameters.super';
import { siblingRequiredValidator } from '../sibling-validator.directive';

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
  dateAchieved: Control<Date>;
}

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitComponent extends ScoreParameters<SubmitScoreForm> implements OnInit, AfterViewInit {
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
    private activatedRoute: ActivatedRoute,
    private gameModeStageService: GameModeStageService
  ) {
    super(gameService, modeService, typeService, stageService);
    this.init();
  }

  @ViewChild('formRef') formRef: FormGroupDirective;

  maskEnum = MaskEnum;
  maskPatterns = MaskEnumPatterns;

  form = this.initialForm();

  get scorePlayersControl(): FormArray<ScorePlayerAddDtoForm> {
    return this.form.get('scorePlayers');
  }

  characters$ = combineLatest([this.valueChanges('idGame', true), this.valueChanges('idMode', true)]).pipe(
    switchMap(([idGame, idMode]) => this.characterService.findByParams({ idGame, idMode })),
    shareReplay()
  );
  gameModeStage$ = combineLatest([
    this.valueChanges('idStage', true),
    this.valueChanges('idGame', true),
    this.valueChanges('idMode', true),
  ]).pipe(
    switchMap(([idStage, idGame, idMode]) =>
      this.gameModeStageService.findOneByParams({ idGame, idMode, idStage })
    ),
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

  requireApprovalMsg$ = this.form.valueChanges.pipe(
    filter(() => this.form.valid),
    distinctUntilChanged(isEqual),
    switchMap(({ scorePlayers, ...dto }) => {
      const dtoAverage: ScoreAverageDto = dto;
      const type = this.typeQuery.getEntity(dtoAverage.idType);
      dto.idCharacters = scorePlayers
        .filter((_, index) => index + 1 <= type.playerQuantity)
        .map(player => player.idCharacter);
      return this.scoreService
        .findRequireApproval(dtoAverage)
        .pipe(map(require => (require ? 'This score will require approval of an Admin' : null)));
    })
  );

  trackByPlatform = trackByPlatform;
  trackByGame = trackByGame;
  trackByMode = trackByMode;
  trackByType = trackByType;
  trackByScorePlayerControl = trackByFactory<FormGroup<ScorePlayerAddDtoForm, ValidatorsModel>>();
  trackBySite = trackBySite;
  trackByUser = trackByUser;

  now = new Date();

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
      time: [null, [Validators.required]],
      dateAchieved: [null],
      scorePlayers: this.formBuilder.array([
        this.formBuilder.group<ScorePlayerAddDtoForm>({
          idPlayer: [this.authQuery.getUserSnapshot().id, [Validators.required]],
          idCharacter: this.formBuilder.control<number>(null, [Validators.required]),
          bulletKills: this.formBuilder.control<number>(null),
          host: this.formBuilder.control<boolean>(true),
          player: this.formBuilder.control<User>(this.authQuery.getUserSnapshot(), [Validators.required]),
          description: this.formBuilder.control<string>(null),
          scorePlayerProofs: this.scorePlayerProofArray(true),
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

  private scorePlayerProofArray(validate?: boolean): FormArray<ScorePlayerProofAddDtoForm> {
    return this.formBuilder.array<ScorePlayerProofAddDtoForm>([
      this.formBuilder.group<ScorePlayerProofAddDtoForm>({
        url: this.formBuilder.control(
          null,
          validate ? { validators: [siblingRequiredValidator('idSite')], updateOn: 'blur' } : []
        ),
        idSite: this.formBuilder.control(
          null,
          validate ? { validators: [siblingRequiredValidator('url')] } : []
        ),
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
}
