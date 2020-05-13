import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GameModePlatform } from '../../model/game-mode-platform';
import { GameModePlatformService } from './game-mode-platform.service';

@Injectable({ providedIn: 'root' })
export class GameModePlatformResolver implements Resolve<GameModePlatform[]> {
  constructor(private gameModePlatformService: GameModePlatformService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<GameModePlatform[]>
    | Promise<GameModePlatform[]>
    | GameModePlatform[] {
    return this.gameModePlatformService.findAll();
  }
}
