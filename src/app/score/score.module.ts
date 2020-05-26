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

@NgModule({
  declarations: [
    SubmitScoreAlphaComponent,
    TableComponent,
    TableControlPanelComponent,
    ScoreTableComponent,
    BestScorePipe,
    BestScoreTotalPipe,
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
  ],
  exports: [ScoreTableComponent],
})
export class ScoreModule {}
