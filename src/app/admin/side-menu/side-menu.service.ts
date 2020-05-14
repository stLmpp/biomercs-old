import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SideMenu } from '../../model/side-menu';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SideMenuService {
  private _list$ = new BehaviorSubject<SideMenu[]>([
    { title: 'Home', routerLink: 'home', padding: true },
    { title: 'User', routerLink: 'user', padding: true },
    { title: 'Game', routerLink: 'game' },
    { title: 'Mode', routerLink: 'mode' },
    { title: 'Game Mode', routerLink: 'game-mode' },
    { title: 'Stage', routerLink: 'stage' },
    { title: 'Character', routerLink: 'character' },
    { title: 'Game Mode Character', routerLink: 'game-mode-character' },
    { title: 'Type', routerLink: 'type' },
    { title: 'Game Mode Type', routerLink: 'game-mode-type' },
    { title: 'Platform', routerLink: 'platform' },
    { title: 'Game Mode Platform', routerLink: 'game-mode-platform' },
    { title: 'Site', routerLink: 'site' },
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
