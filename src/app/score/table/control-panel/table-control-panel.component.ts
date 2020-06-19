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
import { combineLatest, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  shareReplay,
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
import { isEqual } from 'lodash';
import { ScoreParameters } from '../../score-parameters.super';

export type ScoreTableParamsForm = Omit<ScoreTableParamsDto, 'type'>;

@Component({
  selector: 'app-table-control-panel',
  templateUrl: './table-control-panel.component.html',
  styleUrls: ['./table-control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlPanelComponent extends ScoreParameters<ScoreTableParamsForm>
  implements OnInit, OnDestroy {
  constructor(
    private gameService: GameService,
    private modeService: ModeService,
    private typeService: TypeService,
    private characterService: CharacterService
  ) {
    super(gameService, modeService, typeService);
    this.init();
  }

  private _destroyParams$ = new Subject();

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
    this.idPlatformControl.setValue(idPlatform);
  }
  private _idPlatform: number;

  @Input()
  get idGame(): number {
    return this._idGame;
  }
  set idGame(idGame: number) {
    this._idGame = idGame;
    this.idGameControl.setValue(idGame);
  }
  private _idGame: number;

  @Input()
  get idMode(): number {
    return this._idMode;
  }
  set idMode(idMode: number) {
    this._idMode = idMode;
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
    idGame: new FormControl(null, [Validators.required]),
    idMode: new FormControl(null, [Validators.required]),
    idType: new FormControl(null, [Validators.required]),
    idCharacter: new FormControl(null),
    idPlayer: new FormControl(null),
    limit: new FormControl(10),
  });

  get idPlayerControl(): FormControl<number> {
    return this.form.get('idPlayer');
  }

  get idPlatformControl(): FormControl<number> {
    return this.form.get('idPlatform');
  }

  get idCharacterControl(): FormControl<number> {
    return this.form.get('idCharacter');
  }

  characters$ = combineLatest([this.valueChanges('idGame', true), this.valueChanges('idMode', true)]).pipe(
    switchMap(([idGame, idMode]) => {
      this.idCharacterControl.disable();
      return this.characterService.findByParams({ idGame, idMode }).pipe(
        finalize(() => {
          this.idCharacterControl.enable();
        })
      );
    }),
    shareReplay()
  );

  trackByPlatform = trackByPlatform;
  trackByGame = trackByGame;
  trackByMode = trackByMode;
  trackByType = trackByType;
  trackByCharacter = trackByCharacter;

  onSubmit(): void {
    if (this.loading) return;
    this.paramsChange.emit({ ...this.form.value, type: this.tableType });
    this.params = { ...this.form.value, type: this.tableType };
  }

  subToChanges(): void {
    this.checkNextParameter(this.games$, this.idGameControl);
    this.checkNextParameter(this.modes$, this.idModeControl);
    this.checkNextParameter(this.types$, this.idTypeControl);
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
    super.ngOnDestroy();
    this._destroyParams$.next();
    this._destroyParams$.complete();
  }
}
