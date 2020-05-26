import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PlatformQuery } from '../../state/platform/platform.query';
import { GameQuery } from '../../state/game/game.query';
import { ModeQuery } from '../../state/mode/mode.query';
import { TypeQuery } from '../../state/type/type.query';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidatorsModel,
} from '@ng-stack/forms';
import { ScoreAddDto } from '../../model/score';
import { ScorePlayerAddDto } from '../../model/score-player';
import { AuthQuery } from '../../auth/state/auth.query';
import { ScoreService } from '../../state/score/score.service';
import { StageQuery } from '../../state/stage/stage.query';
import { MaskEnum } from '../../model/mask.enum';
import { CharacterQuery } from '../../state/character/character.query';

@Component({
  selector: 'app-submit-score-alpha',
  templateUrl: './submit-score-alpha.component.html',
  styleUrls: ['./submit-score-alpha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitScoreAlphaComponent implements OnInit {
  constructor(
    public platformQuery: PlatformQuery,
    public gameQuery: GameQuery,
    public modeQuery: ModeQuery,
    public typeQuery: TypeQuery,
    public stageQuery: StageQuery,
    public characterQuery: CharacterQuery,
    private authQuery: AuthQuery,
    private scoreService: ScoreService
  ) {}

  maskEnum = MaskEnum;

  form = new FormGroup<ScoreAddDto>({
    idPlatform: new FormControl(1),
    idMode: new FormControl(1),
    idGame: new FormControl(1),
    description: new FormControl(),
    idStage: new FormControl(),
    idType: new FormControl(3),
    maxCombo: new FormControl(),
    score: new FormControl(),
    scorePlayers: new FormArray<ScorePlayerAddDto, ValidatorsModel>([]),
    time: new FormControl(),
  });

  get scorePlayersControl(): FormGroup[] {
    return this.form.get('scorePlayers').controls;
  }

  save(): void {
    this.scoreService.add(this.form.value).subscribe(() => {
      this.form.patchValue({ score: null });
    });
  }

  addPlayer(): void {
    this.form.get('scorePlayers').push(
      new FormGroup({
        bulletKils: new FormControl(0),
        host: new FormControl(true),
        idCharacter: new FormControl(),
        idPlayer: new FormControl(15),
      })
    );
  }

  ngOnInit(): void {
    this.form.get('scorePlayers').push(
      new FormGroup({
        bulletKils: new FormControl(0),
        host: new FormControl(true),
        idCharacter: new FormControl(),
        idPlayer: new FormControl(1),
      })
    );
  }
}
