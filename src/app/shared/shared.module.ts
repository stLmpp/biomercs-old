import { ModuleWithProviders, NgModule } from '@angular/core';
import { DefaultPipe } from './default/default.pipe';
import { FilterPipe } from './filter/filter.pipe';
import { GetDeepPipe } from './get-deep/get-deep.pipe';
import { OrderByPipe } from './order-by/order-by.pipe';
import { SearchPipe } from './search/search.pipe';
import { SumByPipe } from './sum-by/sum-by.pipe';
import { DisabledControlDirective } from './disabled-control/disabled-control.directive';
import { LetDirective } from './let/let.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

const PIPES = [
  DefaultPipe,
  FilterPipe,
  GetDeepPipe,
  OrderByPipe,
  SearchPipe,
  SumByPipe,
];
const DIRECTIVES = [DisabledControlDirective, LetDirective];

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatIconModule,
  MatButtonModule,
];

@NgModule({
  imports: [...MODULES],
  declarations: [...PIPES, ...DIRECTIVES],
  exports: [...MODULES, ...PIPES, ...DIRECTIVES],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
    };
  }
}
