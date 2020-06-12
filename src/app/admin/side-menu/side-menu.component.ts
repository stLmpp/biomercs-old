import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { trackByFactory } from '@stlmpp/utils';
import { SideMenu } from '../../model/side-menu';
import { SideMenuService } from './side-menu.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit, OnDestroy {
  constructor(
    public sideMenuService: SideMenuService,
    private router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  private _destroy$ = new Subject();

  get activatedRoute(): ActivatedRoute {
    let state = this._activatedRoute;
    while (state.firstChild) {
      state = state.firstChild;
    }
    return state;
  }

  trackBy = trackByFactory<SideMenu>('title');

  ngOnInit(): void {
    this.sideMenuService.setActive(this.activatedRoute.snapshot.routeConfig.path);
    this.router.events
      .pipe(
        takeUntil(this._destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.sideMenuService.setActive(this.activatedRoute.snapshot.routeConfig.path);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
