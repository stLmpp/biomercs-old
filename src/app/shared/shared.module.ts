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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogActionsAlignDirective } from './custom-material/mat-dialog-actions-align.directive';
import { MatListActiveDirective } from './custom-material/mat-list-active.directive';
import { ImageComponent } from './file-upload/image.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsTypePipe } from './is-type/is-type.pipe';
import { ImageDirective } from './file-upload/image.directive';

const PIPES = [
  DefaultPipe,
  FilterPipe,
  GetDeepPipe,
  OrderByPipe,
  SearchPipe,
  SumByPipe,
  IsTypePipe,
  ImageDirective,
];
const DIRECTIVES = [
  DisabledControlDirective,
  LetDirective,
  MatDialogActionsAlignDirective,
  MatListActiveDirective,
];

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDialogModule,
  MatProgressSpinnerModule,
];

const COMPONENTS = [ImageComponent];

@NgModule({
  imports: [...MODULES],
  declarations: [...PIPES, ...DIRECTIVES, ...COMPONENTS],
  exports: [...MODULES, ...PIPES, ...DIRECTIVES, ...COMPONENTS],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
    };
  }
}
