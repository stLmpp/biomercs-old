import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { UserCardComponent } from './profile/user-card/user-card.component';
import { UserLinkComponent } from './profile/user-card/add-link/user-link.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { FollowersComponent } from './profile/user-card/followers/followers.component';
import { StUtilsModule } from '@stlmpp/utils';

@NgModule({
  declarations: [
    ProfileComponent,
    UserCardComponent,
    UserLinkComponent,
    FollowersComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatListModule,
    MatSelectModule,
    MatMenuModule,
    OverlayModule,
    A11yModule,
    StUtilsModule,
  ],
})
export class UserModule {}
