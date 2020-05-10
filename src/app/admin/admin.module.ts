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
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseRelationComponent } from './base/base-relation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapRelationPipe } from './base/map-relation.pipe';
import { StageComponent } from './stage/stage.component';
import { SiteComponent } from './site/site.component';

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
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
})
export class AdminModule {}
