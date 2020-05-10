import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GameComponent } from './game/game.component';
import { GameResolver } from '../state/game/game.resolver';
import { AdminGuard } from './admin.guard';
import { ModeComponent } from './mode/mode.component';
import { ModeResolver } from '../state/mode/mode.resolver';
import { GameModeComponent } from './game-mode/game-mode.component';
import { GameModeResolver } from '../state/game-mode/game-mode.resolver';
import { StageComponent } from './stage/stage.component';
import { StageResolver } from '../state/stage/stage.resolver';
import { SiteComponent } from './site/site.component';
import { SiteResolver } from '../state/site/site.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'game',
        component: GameComponent,
        resolve: [GameResolver],
      },
      {
        path: 'mode',
        component: ModeComponent,
        resolve: [ModeResolver],
      },
      {
        path: 'game-mode',
        component: GameModeComponent,
        resolve: [GameResolver, ModeResolver, GameModeResolver],
      },
      {
        path: 'stage',
        component: StageComponent,
        resolve: [GameResolver, StageResolver],
      },
      {
        path: 'site',
        component: SiteComponent,
        resolve: [SiteResolver],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
