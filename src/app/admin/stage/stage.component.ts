import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StageService } from '../../state/stage/stage.service';
import { StageQuery } from '../../state/stage/stage.query';
import { GameQuery } from '../../state/game/game.query';
import { FieldsConfig } from '../base/base.component';
import { Game } from '../../model/game';
import { Validators } from '@angular/forms';
import { Stage } from '../../model/stage';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageComponent implements OnInit {
  constructor(
    public stageService: StageService,
    public stageQuery: StageQuery,
    public gameQuery: GameQuery
  ) {}

  fieldsConfig: FieldsConfig<Stage, Game> = {
    name: {
      validators: [Validators.required],
    },
    shortName: {
      validators: [Validators.required],
    },
    idGame: {
      validators: [Validators.required],
      selectOptions: this.gameQuery.all$,
      placeholder: 'Game',
      type: 'select',
      selectLabel: 'name',
      selectValue: 'id',
    },
    custom: {
      type: 'checkbox',
    },
  };

  ngOnInit(): void {}
}
