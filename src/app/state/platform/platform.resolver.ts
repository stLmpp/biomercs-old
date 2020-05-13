import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Platform } from '../../model/platform';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class PlatformResolver implements Resolve<Platform[]> {
  constructor(private platformService: PlatformService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Platform[]> | Promise<Platform[]> | Platform[] {
    return this.platformService.findAll();
  }
}
