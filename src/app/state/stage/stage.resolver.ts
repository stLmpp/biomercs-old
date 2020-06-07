import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Stage } from '../../model/stage';
import { StageService } from './stage.service';

@Injectable({ providedIn: 'root' })
export class StageResolver implements Resolve<Stage[]> {
  constructor(private stageService: StageService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Stage[]> | Promise<Stage[]> | Stage[] {
    return this.stageService.findAll();
  }
}
