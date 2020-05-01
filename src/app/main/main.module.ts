import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const DECLARATIONS = [HeaderComponent];

@NgModule({
  imports: [
    SharedModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class MainModule {}
