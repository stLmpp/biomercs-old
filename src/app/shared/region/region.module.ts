import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { SelectRegionComponent } from './select-region/select-region.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { StUtilsModule } from '@stlmpp/utils';
import { ScrollModule } from '../scroll/scroll.module';

@NgModule({
  imports: [SharedModule, ScrollingModule, MatListModule, StUtilsModule, ScrollModule],
  declarations: [SelectRegionComponent],
  exports: [SelectRegionComponent],
})
export class RegionModule {}
