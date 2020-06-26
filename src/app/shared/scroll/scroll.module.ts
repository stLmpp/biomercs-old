import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { SrollBoosterItemDirective } from './scroll-booster/sroll-booster-item.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollBoosterDirective } from './scroll-booster/scroll-booster.directive';
import { ScrollBoosterContentDirective } from './scroll-booster/scroll-booster-content.directive';
import { BioScrollDirective } from './bio-scroll.directive';

@NgModule({
  imports: [SharedModule, InfiniteScrollModule],
  declarations: [
    SrollBoosterItemDirective,
    ScrollBoosterDirective,
    ScrollBoosterContentDirective,
    BioScrollDirective,
  ],
  exports: [
    SrollBoosterItemDirective,
    InfiniteScrollModule,
    ScrollBoosterDirective,
    ScrollBoosterContentDirective,
    BioScrollDirective,
  ],
})
export class ScrollModule {}
