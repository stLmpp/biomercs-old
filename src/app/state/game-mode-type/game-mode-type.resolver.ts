import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GameModeType } from '../../model/game-mode-type';
import { GameModeTypeService } from './game-mode-type.service';

@Injectable({ providedIn: 'root' })
export class GameModeTypeResolver implements Resolve<GameModeType[]> {
  constructor(private gameModeTypeService: GameModeTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GameModeType[]> | Promise<GameModeType[]> | GameModeType[] {
    return this.gameModeTypeService.findAll();
  }
}
