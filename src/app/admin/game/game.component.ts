import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameQuery } from '../../state/game/game.query';
import { trackByFactory } from '../../util/util';
import { Game } from '../../model/game';
import { GameService } from '../../state/game/game.service';
import { FieldsConfig } from '../base/base.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  constructor(public gameQuery: GameQuery, public gameService: GameService) {}

  trackBy = trackByFactory<Game>('id');

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
