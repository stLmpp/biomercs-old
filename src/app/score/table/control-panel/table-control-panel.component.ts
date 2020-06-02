import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { ScoreTableParamsDto, ScoreTableType } from '../../../model/score';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  skip,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { GameService } from '../../../state/game/game.service';
import { ModeService } from '../../../state/mode/mode.service';
import { TypeService } from '../../../state/type/type.service';
import { Platform, trackByPlatform } from '../../../model/platform';
import { CharacterService } from '../../../state/character/character.service';
import { trackByGame } from '../../../model/game';
import { trackByMode } from '../../../model/mode';
import { trackByType } from '../../../model/type';
import { trackByCharacter } from '../../../model/character';
import { isEqual } from 'underscore';

export type ScoreTableParamsForm = Omit<ScoreTableParamsDto, 'type'>;

@Component({
  selector: 'app-table-control-panel',
  templateUrl: './table-control-panel.component.html',
  styleUrls: ['./table-control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlPanelComponent implements OnInit, OnDestroy {
  constructor(
    private gameService: GameService,
    private modeService: ModeService,
    private typeService: TypeService,
    private characterService: CharacterService
  ) {}

  private _destroy$ = new Subject();
  private _destroyParams$ = new Subject();

  scoreTableType = ScoreTableType;

  @Input() platforms: Platform[] = [];
  @Input() tableType: ScoreTableType;
  @Input() params: ScoreTableParamsDto;
  @Input()
  get idPlayer(): number {
    return this._idPlayer;
  }
  set idPlayer(idPlayer: number) {
    this._idPlayer = idPlayer;
    this.idPlayerControl.setValue(idPlayer);
  }
  private _idPlayer: number;

  @Input()
  get idCharacter(): number {
    return this._idCharacter;
  }
  set idCharacter(idCharacter: number) {
    this._idCharacter = idCharacter;
    this.idCharacterControl.setValue(idCharacter);
  }
  private _idCharacter: number;
  @Input() characterDisabled: boolean;

  @Input()
  get idPlatform(): number {
    return this._idPlatform;
  }
  set idPlatform(idPlatform: number) {
    this._idPlatform = idPlatform;
    this.resubToChangesIfNeeded();
    this.idPlatformControl.setValue(idPlatform);
  }
  private _idPlatform: number;

  @Input()
  get idGame(): number {
    return this._idGame;
  }
  set idGame(idGame: number) {
    this._idGame = idGame;
    this.resubToChangesIfNeeded();
    this.idGameControl.setValue(idGame);
  }
  private _idGame: number;

  @Input()
  get idMode(): number {
    return this._idMode;
  }
  set idMode(idMode: number) {
    this._idMode = idMode;
    this.resubToChangesIfNeeded();
    this.idModeControl.setValue(idMode);
  }
  private _idMode: number;

  @Input()
  get idType(): number {
    return this._idType;
  }
  set idType(idType: number) {
    this._idType = idType;
    this.idTypeControl.setValue(idType);
  }
  private _idType: number;

  @Input() autoExecute: boolean;

  @Input('loading')
  set _loading(loading: boolean) {
    this.loading = loading;
    this.form[loading ? 'disable' : 'enable']();
  }
  loading: boolean;

  @Output() paramsChange = new EventEmitter<ScoreTableParamsDto>();

  form = new FormGroup<ScoreTableParamsForm>({
    idPlatform: new FormControl(null, [Validators.required]),
    idGame: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    idMode: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    idType: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    idCharacter: new FormControl({ value: null, disabled: true }),
    idPlayer: new FormControl({ value: null, disabled: true }),
    limit: new FormControl(10),
  });

  get idPlayerControl(): FormControl {
    return this.form.get('idPlayer');
  }

  get idPlatformControl(): FormControl {
    return this.form.get('idPlatform');
  }

  get idGameControl(): FormControl {
    return this.form.get('idGame');
  }

  get idModeControl(): FormControl {
    return this.form.get('idMode');
  }

  get idCharacterControl(): FormControl {
    return this.form.get('idCharacter');
  }

  get idTypeControl(): FormControl {
    return this.form.get('idType');
  }

  games$ = this.valueChanges('idPlatform', true).pipe(
    switchMap(idPlatform => this.gameService.findByParams({ idPlatform }))
  );
  modes$ = combineLatest([
    this.valueChanges('idPlatform', true),
    this.valueChanges('idGame', true),
  ]).pipe(
    switchMap(([idPlatform, idGame]) =>
      this.modeService.findByParams({ idGame, idPlatform })
    )
  );
  types$ = combineLatest([
    this.valueChanges('idGame', true),
    this.valueChanges('idMode', true),
  ]).pipe(
    switchMap(([idGame, idMode]) =>
      this.typeService.findByParams({ idGame, idMode })
    )
  );
  characters$ = combineLatest([
    this.valueChanges('idGame', true),
    this.valueChanges('idMode', true),
  ]).pipe(
    switchMap(([idGame, idMode]) =>
      this.characterService.findByParams({ idGame, idMode })
    )
  );

  trackByPlatform = trackByPlatform;
  trackByGame = trackByGame;
  trackByMode = trackByMode;
  trackByType = trackByType;
  trackByCharacter = trackByCharacter;

  private valueChanges<K extends keyof ScoreTableParamsForm>(
    key: K,
    filterNil?: boolean
  ): Observable<ScoreTableParamsForm[K]> {
    let changes$ = (this.form.get(key).valueChanges as Observable<
      ScoreTableParamsForm[K]
    >).pipe(distinctUntilChanged());
    if (filterNil) {
      changes$ = changes$.pipe(filter(value => !!value));
    }
    return changes$;
  }

  onSubmit(): void {
    if (this.loading) return;
    this.paramsChange.emit({ ...this.form.value, type: this.tableType });
    this.params = { ...this.form.value, type: this.tableType };
  }

  resubToChangesIfNeeded(): void {
    if (this.autoExecute) {
      this._destroyParams$.next();
      this.subToChanges();
    }
  }

  subToChanges(): void {
    this.valueChanges('idPlatform')
      .pipe(takeUntil(this._destroyParams$), skip(1))
      .subscribe(idPlatform => {
        if (!idPlatform) {
          this.idGameControl.disable();
        } else {
          this.idGameControl.enable();
        }
        this.idGameControl.setValue(null);
      });
    this.valueChanges('idGame')
      .pipe(takeUntil(this._destroyParams$), skip(1))
      .subscribe(idGame => {
        if (!idGame) {
          this.idModeControl.disable();
        } else {
          this.idModeControl.enable();
        }
        this.idModeControl.setValue(null);
      });
    this.valueChanges('idMode')
      .pipe(takeUntil(this._destroyParams$), skip(1))
      .subscribe(idMode => {
        if (!idMode) {
          this.idCharacterControl.disable();
          this.idTypeControl.disable();
        } else {
          this.idCharacterControl.enable();
          this.idTypeControl.enable();
        }
        this.idCharacterControl.setValue(null);
        this.idTypeControl.setValue(null);
      });
  }

  ngOnInit(): void {
    this.subToChanges();
    this.form.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        distinctUntilChanged(isEqual),
        debounceTime(200),
        filter(() => this.autoExecute)
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._destroyParams$.next();
    this._destroyParams$.complete();
  }
}
