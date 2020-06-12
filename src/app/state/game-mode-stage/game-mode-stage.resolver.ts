import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GameModeStage } from '../../model/game-mode-stage';
import { GameModeStageService } from './game-mode-stage.service';

@Injectable({ providedIn: 'root' })
export class GameModeStageResolver implements Resolve<GameModeStage[]> {
  constructor(private gameModeStageService: GameModeStageService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GameModeStage[]> | Promise<GameModeStage[]> | GameModeStage[] {
    return this.gameModeStageService.findAll();
  }
}
