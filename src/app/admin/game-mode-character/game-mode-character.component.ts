import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameModeCharacterQuery } from '../../state/game-mode-character/game-mode-character.query';
import { GameModeCharacterService } from '../../state/game-mode-character/game-mode-character.service';
import { GameModeQuery } from '../../state/game-mode/game-mode.query';
import { CharacterQuery } from '../../state/character/character.query';

@Component({
  selector: 'app-game-mode-character',
  templateUrl: './game-mode-character.component.html',
  styleUrls: ['./game-mode-character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModeCharacterComponent implements OnInit {
  constructor(
    public gameModeCharacterQuery: GameModeCharacterQuery,
    public gameModeCharacterService: GameModeCharacterService,
    public gameModeQuery: GameModeQuery,
    public characterQuery: CharacterQuery
  ) {}

  ngOnInit(): void {}
}
