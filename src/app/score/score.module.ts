import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MatDividerModule } from '@angular/material/divider';
import { TableComponent } from './table/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { TableControlPanelComponent } from './table/control-panel/table-control-panel.component';
import { ScoreTableComponent } from './table/score-table.component';
import { BestScorePipe } from './table/table/best-score.pipe';
import { BestScoreTotalPipe } from './table/table/best-score-total.pipe';
import { ScoreComponent } from './score/score.component';
import { ClipPathDirective } from './score/clip-path.directive';
import { ScorePlayerComponent } from './score/score-player/score-player.component';
import { ScoreFooterComponent } from './score/score-footer/score-footer.component';
import { ReportModule } from '../shared/report/report.module';
import { StUtilsModule } from '@stlmpp/utils';
import { LikeModule } from '../shared/like/like.module';
import { SubmitComponent } from './submit/submit.component';
import { SelectComponent } from './submit/select/select.component';
import { MatRippleModule } from '@angular/material/core';
import { A11yModule } from '@angular/cdk/a11y';
import { ScrollModule } from '../shared/scroll/scroll.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  declarations: [
    TableComponent,
    TableControlPanelComponent,
    ScoreTableComponent,
    BestScorePipe,
    BestScoreTotalPipe,
    ScoreComponent,
    ClipPathDirective,
    ScorePlayerComponent,
    ScoreFooterComponent,
    SubmitComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    ScoreRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
    NgxMaskModule.forChild(),
    MatDividerModule,
    MatTableModule,
    ReportModule,
    StUtilsModule,
    LikeModule,
    MatRippleModule,
    A11yModule,
    ScrollModule,
    MatAutocompleteModule,
    NgxCurrencyModule,
  ],
  exports: [ScoreTableComponent, ScoreComponent],
})
export class ScoreModule {}
