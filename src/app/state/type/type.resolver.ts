import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Type } from '../../model/type';
import { TypeService } from './type.service';

@Injectable({ providedIn: 'root' })
export class TypeResolver implements Resolve<Type[]> {
  constructor(private typeService: TypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Type[]> | Promise<Type[]> | Type[] {
    return this.typeService.findAll();
  }
}
