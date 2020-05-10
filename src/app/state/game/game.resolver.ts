import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Game } from '../../model/game';
import { Observable } from 'rxjs';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class GameResolver implements Resolve<Game[]> {
  constructor(private gameService: GameService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Game[]> | Promise<Game[]> | Game[] {
    return this.gameService.findAll();
  }
}
