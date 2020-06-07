import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../../model/site';
import { SiteService } from './site.service';

@Injectable({ providedIn: 'root' })
export class SiteResolver implements Resolve<Site[]> {
  constructor(private siteService: SiteService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Site[]> | Promise<Site[]> | Site[] {
    return this.siteService.findAll();
  }
}
