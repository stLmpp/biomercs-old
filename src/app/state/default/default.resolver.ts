import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Default } from '../../model/default';
import { DefaultService } from './default.service';

@Injectable({ providedIn: 'root' })
export class DefaultResolver implements Resolve<Default> {
  constructor(private defaultService: DefaultService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Default> | Promise<Default> | Default {
    return this.defaultService.getDefault();
  }
}
