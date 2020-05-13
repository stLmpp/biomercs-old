import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameModeQuery } from '../../state/game-mode/game-mode.query';
import { PlatformQuery } from '../../state/platform/platform.query';
import { GameModePlatformQuery } from '../../state/game-mode-platform/game-mode-platform.query';
import { GameModePlatformService } from '../../state/game-mode-platform/game-mode-platform.service';

@Component({
  selector: 'app-game-mode-platform',
  templateUrl: './game-mode-platform.component.html',
  styleUrls: ['./game-mode-platform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModePlatformComponent implements OnInit {
  constructor(
    public gameModeQuery: GameModeQuery,
    public platformQuery: PlatformQuery,
    public gameModePlatformQuery: GameModePlatformQuery,
    public gameModePlatformService: GameModePlatformService
  ) {}

  ngOnInit(): void {}
}
