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
import { CharacterComponent } from './character/character.component';
import { CharacterResolver } from '../state/character/character.resolver';
import { GameModeCharacterComponent } from './game-mode-character/game-mode-character.component';
import { GameModeCharacterResolver } from '../state/game-mode-character/game-mode-character.resolver';
import { TypeComponent } from './type/type.component';
import { TypeResolver } from '../state/type/type.resolver';
import { GameModeTypeComponent } from './game-mode-type/game-mode-type.component';
import { GameModeTypeResolver } from '../state/game-mode-type/game-mode-type.resolver';
import { PlatformComponent } from './platform/platform.component';
import { PlatformResolver } from '../state/platform/platform.resolver';
import { GameModePlatformComponent } from './game-mode-platform/game-mode-platform.component';
import { GameModePlatformResolver } from '../state/game-mode-platform/game-mode-platform.resolver';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { OwnerGuard } from './owner.guard';
import { RoleResolver } from '../state/role/role.resolver';
import { RoleComponent } from './role/role.component';
import { ReasonComponent } from './reason/reason.component';
import { ReasonResolver } from '../state/reason/reason.resolver';
import { GameModeStageComponent } from './game-mode-stage/game-mode-stage.component';
import { GameModeStageResolver } from '../state/game-mode-stage/game-mode-stage.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [OwnerGuard],
        resolve: [RoleResolver],
      },
      {
        path: 'role',
        component: RoleComponent,
        canActivate: [OwnerGuard],
        resolve: [RoleResolver],
      },
      {
        path: 'reason',
        component: ReasonComponent,
        resolve: [ReasonResolver],
      },
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
        path: 'game-mode-stage',
        component: GameModeStageComponent,
        resolve: [GameModeStageResolver, GameModeResolver, StageResolver],
      },
      {
        path: 'character',
        component: CharacterComponent,
        resolve: [CharacterResolver],
      },
      {
        path: 'game-mode-character',
        component: GameModeCharacterComponent,
        resolve: [CharacterResolver, GameModeResolver, GameModeCharacterResolver],
      },
      {
        path: 'type',
        component: TypeComponent,
        resolve: [TypeResolver],
      },
      {
        path: 'game-mode-type',
        component: GameModeTypeComponent,
        resolve: [TypeResolver, GameModeResolver, GameModeTypeResolver],
      },
      {
        path: 'platform',
        component: PlatformComponent,
        resolve: [PlatformResolver],
      },
      {
        path: 'game-mode-platform',
        component: GameModePlatformComponent,
        resolve: [GameModeResolver, PlatformResolver, GameModePlatformResolver],
      },
      {
        path: 'site',
        component: SiteComponent,
        resolve: [SiteResolver],
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
