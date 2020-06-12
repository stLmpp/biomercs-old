import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameModeStageQuery } from '../../state/game-mode-stage/game-mode-stage.query';
import { GameModeStageService } from '../../state/game-mode-stage/game-mode-stage.service';
import { GameModeQuery } from '../../state/game-mode/game-mode.query';
import { StageQuery } from '../../state/stage/stage.query';
import { FieldsConfig } from '../base/base-add-edit/base-add-edit.component';
import { GameModeStage } from '../../model/game-mode-stage';
import { Validators } from '@ng-stack/forms';

@Component({
  selector: 'app-game-mode-stage',
  templateUrl: './game-mode-stage.component.html',
  styleUrls: ['./game-mode-stage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModeStageComponent implements OnInit {
  constructor(
    public gameModeStageQuery: GameModeStageQuery,
    public gameModeStageService: GameModeStageService,
    public gameModeQuery: GameModeQuery,
    public stageQuery: StageQuery
  ) {}

  fieldsConfig: FieldsConfig<GameModeStage> = {
    maxEnemies: {
      type: 'number',
      validators: [Validators.required],
    },
    maxCombo: {
      type: 'number',
      validators: [Validators.required],
    },
  };

  ngOnInit(): void {}
}
