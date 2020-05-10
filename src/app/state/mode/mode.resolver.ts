import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Mode } from '../../model/mode';
import { ModeService } from './mode.service';

@Injectable({ providedIn: 'root' })
export class ModeResolver implements Resolve<Mode[]> {
  constructor(private modeService: ModeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Mode[]> | Promise<Mode[]> | Mode[] {
    return this.modeService.findAll();
  }
}
