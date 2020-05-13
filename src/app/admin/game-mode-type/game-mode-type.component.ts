import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameModeTypeQuery } from '../../state/game-mode-type/game-mode-type.query';
import { GameModeQuery } from '../../state/game-mode/game-mode.query';
import { TypeQuery } from '../../state/type/type.query';
import { GameModeTypeService } from '../../state/game-mode-type/game-mode-type.service';

@Component({
  selector: 'app-game-mode-type',
  templateUrl: './game-mode-type.component.html',
  styleUrls: ['./game-mode-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModeTypeComponent implements OnInit {
  constructor(
    public gameModeTypeQuery: GameModeTypeQuery,
    public gameModeQuery: GameModeQuery,
    public typeQuery: TypeQuery,
    public gameModeTypeService: GameModeTypeService
  ) {}

  ngOnInit(): void {}
}
