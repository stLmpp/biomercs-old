import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
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
import { UserShowcaseComponent } from './profile/user-showcase/user-showcase.component';
import { EditInfoComponent } from './profile/user-card/edit-info/edit-info.component';
import { MatTableModule } from '@angular/material/table';
import { ScoreModule } from '../score/score.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReportModule } from '../shared/report/report.module';
import { LikeModule } from '../shared/like/like.module';
import { BadgeModule } from '../shared/badge/badge.module';

@NgModule({
  declarations: [
    ProfileComponent,
    UserCardComponent,
    UserLinkComponent,
    FollowersComponent,
    UserShowcaseComponent,
    EditInfoComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatSelectModule,
    MatMenuModule,
    OverlayModule,
    A11yModule,
    StUtilsModule,
    MatTableModule,
    ScoreModule,
    MatAutocompleteModule,
    ScrollingModule,
    ReportModule,
    LikeModule,
    BadgeModule,
  ],
})
export class UserModule {}
