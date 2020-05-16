import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    SharedModule,
    UserRoutingModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
})
export class UserModule {}
