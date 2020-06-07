import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GameMode } from '../../model/game-mode';
import { GameModeService } from './game-mode.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameModeResolver implements Resolve<GameMode[]> {
  constructor(private gameModeService: GameModeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GameMode[]> | Promise<GameMode[]> | GameMode[] {
    return this.gameModeService.findAll();
  }
}
