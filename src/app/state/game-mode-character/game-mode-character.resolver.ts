import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GameModeCharacter } from '../../model/game-mode-character';
import { GameModeCharacterService } from './game-mode-character.service';

@Injectable({ providedIn: 'root' })
export class GameModeCharacterResolver implements Resolve<GameModeCharacter[]> {
  constructor(private gameModeCharacterService: GameModeCharacterService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GameModeCharacter[]> | Promise<GameModeCharacter[]> | GameModeCharacter[] {
    return this.gameModeCharacterService.findAll();
  }
}
