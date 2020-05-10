import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SideMenu } from '../../model/side-menu';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SideMenuService {
  private _list$ = new BehaviorSubject<SideMenu[]>([
    {
      title: 'Game',
      routerLink: 'game',
    },
    {
      title: 'Mode',
      routerLink: 'mode',
    },
    {
      title: 'Game Mode',
      routerLink: 'game-mode',
    },
    {
      title: 'Stage',
      routerLink: 'stage',
    },
    {
      title: 'Site',
      routerLink: 'site',
    },
  ]);

  list$ = this._list$.asObservable();
  active$ = this.list$.pipe(map(list => list.find(menu => menu.active)));

  setActive(routerLink: string): void {
    const state = [...this._list$.value].map(o => ({ ...o }));
    this._list$.next(
      state.map(menu => ({ ...menu, active: menu.routerLink === routerLink }))
    );
  }
}
