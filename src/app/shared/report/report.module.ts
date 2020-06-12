import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportButtonComponent } from './report-button/report-button.component';
import { SharedModule } from '../shared.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [ReportButtonComponent],
  imports: [CommonModule, SharedModule, MatListModule],
  exports: [ReportButtonComponent],
})
export class ReportModule {}
