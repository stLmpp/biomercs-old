import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [HeaderComponent];

@NgModule({
  imports: [
    SharedModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressBarModule,
    RouterModule,
  ],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class MainModule {}
