import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameQuery } from '../../state/game/game.query';
import { Game } from '../../model/game';
import { GameService } from '../../state/game/game.service';
import { Validators } from '@ng-stack/forms';
import { FieldsConfig } from '../base/base-add-edit/base-add-edit.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  constructor(public gameQuery: GameQuery, public gameService: GameService) {}

  fieldsConfig: FieldsConfig<Game> = {
    name: {
      validators: [Validators.required],
    },
    shortName: {
      validators: [Validators.required],
    },
  };

  ngOnInit(): void {}
}
