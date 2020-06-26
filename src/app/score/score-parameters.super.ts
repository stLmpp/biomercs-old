import { FormControl, FormGroup } from '@ng-stack/forms';
import { OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { CommonColumns } from '../model/common-history';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  pluck,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { isNil } from '../util/util';
import { GameService } from '../state/game/game.service';
import { ModeService } from '../state/mode/mode.service';
import { TypeService } from '../state/type/type.service';
import { Game } from '../model/game';
import { Mode } from '../model/mode';
import { Type } from '../model/type';
import { StageService } from '../state/stage/stage.service';
import { Stage } from '../model/stage';
import { CharacterService } from '../state/character/character.service';
import { Character } from '../model/character';

interface FormType {
  idGame: number;
  idMode: number;
  idType: number;
  idPlatform: number;
  idStage?: number;
  idCharacter?: number;
}

export class ScoreParameters<T extends FormType> implements OnDestroy {
  constructor(
    private __gameService: GameService,
    private __modeService: ModeService,
    private __typeService: TypeService,
    private __stageService?: StageService,
    private __characterService?: CharacterService
  ) {}

  protected _destroy$ = new Subject();
  public form: FormGroup<FormType>;

  get idGameControl(): FormControl<number> {
    return this.form.get('idGame');
  }

  get idModeControl(): FormControl<number> {
    return this.form.get('idMode');
  }

  get idTypeControl(): FormControl<number> {
    return this.form.get('idType');
  }

  get idStageControl(): FormControl<number> | null {
    return this.form.get('idStage');
  }

  get idCharacterControl(): FormControl<number> | null {
    return this.form.get('idCharacter');
  }

  games$: Observable<Game[]>;
  modes$: Observable<Mode[]>;
  types$: Observable<Type[]>;
  stages$: Observable<Stage[]>;
  characters$: Observable<Character[]>;

  protected valueChanges<K extends keyof T>(key: K, filterNil?: boolean): Observable<T[K]> {
    let values$ = (this.form.get(key as any).valueChanges as Observable<T[K]>).pipe(
      takeUntil(this._destroy$),
      distinctUntilChanged()
    );
    if (filterNil) {
      values$ = values$.pipe(filter(value => !isNil(value)));
    }
    return values$;
  }

  protected checkNextParameter<Entity extends CommonColumns>(
    observable: Observable<Entity[]>,
    checkControl: FormControl<number>,
    clear = false
  ): void {
    const obs$ = observable.pipe(
      takeUntil(this._destroy$),
      filter(values => !!values.length),
      filter(values => !values.some(value => value.id === checkControl.value))
    );
    if (clear) {
      obs$
        .pipe(
          tap(() => {
            checkControl.setValue(null);
          })
        )
        .subscribe();
    } else {
      obs$
        .pipe(
          map(([value]) => value),
          pluck('id'),
          tap(id => {
            checkControl.setValue(id);
          })
        )
        .subscribe();
    }
  }

  protected init(): void {
    this.games$ = this.valueChanges('idPlatform', true).pipe(
      switchMap(idPlatform => {
        this.idGameControl.disable();
        return this.__gameService.findByParams({ idPlatform }).pipe(
          finalize(() => {
            this.idGameControl.enable();
          })
        );
      }),
      shareReplay()
    );
    this.modes$ = combineLatest([
      this.valueChanges('idPlatform', true),
      this.valueChanges('idGame', true),
    ]).pipe(
      switchMap(([idPlatform, idGame]) => {
        this.idModeControl.disable();
        return this.__modeService.findByParams({ idGame, idPlatform }).pipe(
          finalize(() => {
            this.idModeControl.enable();
          })
        );
      }),
      shareReplay()
    );
    this.types$ = combineLatest([this.valueChanges('idGame', true), this.valueChanges('idMode', true)]).pipe(
      switchMap(([idGame, idMode]) => {
        this.idTypeControl.disable();
        return this.__typeService.findByParams({ idGame, idMode }).pipe(
          finalize(() => {
            this.idTypeControl.enable();
          })
        );
      }),
      shareReplay()
    );
    if (this.form.contains('idStage') && this.__stageService) {
      this.stages$ = combineLatest([this.valueChanges('idGame', true), this.valueChanges('idMode')]).pipe(
        switchMap(([idGame, idMode]) => {
          this.idStageControl.disable();
          return this.__stageService.findByParams({ idGame, idMode }).pipe(
            finalize(() => {
              this.idStageControl.enable();
            })
          );
        }),
        shareReplay()
      );
    }
    if (this.form.contains('idCharacter') && this.__characterService) {
      this.characters$ = combineLatest([
        this.valueChanges('idGame', true),
        this.valueChanges('idMode', true),
      ]).pipe(
        switchMap(([idGame, idMode]) => {
          this.idCharacterControl.disable();
          return this.__characterService.findByParams({ idGame, idMode }).pipe(
            finalize(() => {
              this.idCharacterControl.enable();
            })
          );
        }),
        shareReplay()
      );
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
