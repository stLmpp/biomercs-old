import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { SubmitScoreAlphaComponent } from './submit-score-alpha/submit-score-alpha.component';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScorePlayerComponent } from './score/score-player/score-player.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    SubmitScoreAlphaComponent,
    TableComponent,
    TableControlPanelComponent,
    ScoreTableComponent,
    BestScorePipe,
    BestScoreTotalPipe,
    ScoreComponent,
    ClipPathDirective,
    ScorePlayerComponent,
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
    MatTooltipModule,
    MatBadgeModule,
  ],
  exports: [ScoreTableComponent, ScoreComponent],
})
export class ScoreModule {}
