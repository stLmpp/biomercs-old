import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameModeQuery } from '../../state/game-mode/game-mode.query';
import { GameQuery } from '../../state/game/game.query';
import { ModeQuery } from '../../state/mode/mode.query';
import { GameModeService } from '../../state/game-mode/game-mode.service';

@Component({
  selector: 'app-game-mode',
  templateUrl: './game-mode.component.html',
  styleUrls: ['./game-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModeComponent implements OnInit {
  constructor(
    public gameModeQuery: GameModeQuery,
    public gameQuery: GameQuery,
    public modeQuery: ModeQuery,
    public gameModeService: GameModeService
  ) {}

  ngOnInit(): void {}
}
