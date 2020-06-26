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
import { ScoreApprovalComponent } from './score-approval/score-approval.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScoreApprovalTableComponent } from './score-approval/score-approval-table/score-approval-table.component';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { ScoreRejectionMotiveComponent } from './score-approval/score-rejection-motive/score-rejection-motive.component';
import { ScorePlayerProofsIconsComponent } from './score-player-proofs-icons/score-player-proofs-icons.component';
import { ScoreApprovalFillComponent } from './score-approval/score-approval-fill/score-approval-fill.component';

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
    ScoreApprovalComponent,
    ScoreApprovalTableComponent,
    ScoreRejectionMotiveComponent,
    ScorePlayerProofsIconsComponent,
    ScoreApprovalFillComponent,
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
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatListModule,
  ],
  exports: [ScoreTableComponent, ScoreComponent, ScoreApprovalComponent, ScoreApprovalFillComponent],
})
export class ScoreModule {}
