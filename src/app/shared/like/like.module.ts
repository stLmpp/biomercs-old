import { NgModule } from '@angular/core';
import { LikeButtonsComponent } from './like-buttons/like-buttons.component';
import { SharedModule } from '../shared.module';
import { StUtilsModule } from '@stlmpp/utils';

@NgModule({
  declarations: [LikeButtonsComponent],
  imports: [SharedModule, StUtilsModule],
  exports: [LikeButtonsComponent],
})
export class LikeModule {}
