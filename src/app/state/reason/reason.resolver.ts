import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Reason } from '../../model/reason';
import { ReasonService } from './reason.service';

@Injectable({ providedIn: 'root' })
export class ReasonResolver implements Resolve<Reason[]> {
  constructor(private reasonService: ReasonService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Reason[]> | Promise<Reason[]> | Reason[] {
    return this.reasonService.findAll();
  }
}
