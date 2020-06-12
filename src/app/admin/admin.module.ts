import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { GameComponent } from './game/game.component';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { ModeComponent } from './mode/mode.component';
import { GameModeComponent } from './game-mode/game-mode.component';
import { BaseComponent } from './base/base.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseRelationComponent } from './base/base-relation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapRelationPipe } from './base/map-relation.pipe';
import { StageComponent } from './stage/stage.component';
import { SiteComponent } from './site/site.component';
import { CharacterComponent } from './character/character.component';
import { GameModeCharacterComponent } from './game-mode-character/game-mode-character.component';
import { CountRelationPipe } from './base/count-relation.pipe';
import { TypeComponent } from './type/type.component';
import { GameModeTypeComponent } from './game-mode-type/game-mode-type.component';
import { PlatformComponent } from './platform/platform.component';
import { GameModePlatformComponent } from './game-mode-platform/game-mode-platform.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { StUtilsModule } from '@stlmpp/utils';
import { UserRolesComponent } from './user/user-roles/user-roles.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleComponent } from './role/role.component';
import { ReasonComponent } from './reason/reason.component';
import { BadgeModule } from '../shared/badge/badge.module';

@NgModule({
  declarations: [
    AdminComponent,
    SideMenuComponent,
    GameComponent,
    ModeComponent,
    GameModeComponent,
    BaseComponent,
    BaseRelationComponent,
    MapRelationPipe,
    StageComponent,
    SiteComponent,
    CharacterComponent,
    GameModeCharacterComponent,
    CountRelationPipe,
    TypeComponent,
    GameModeTypeComponent,
    PlatformComponent,
    GameModePlatformComponent,
    HomeComponent,
    UserComponent,
    UserRolesComponent,
    RoleComponent,
    ReasonComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    StUtilsModule,
    MatProgressBarModule,
    BadgeModule,
  ],
})
export class AdminModule {}
