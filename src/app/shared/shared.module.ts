import { ModuleWithProviders, NgModule } from '@angular/core';
import { FilterPipe } from './pipes/filter.pipe';
import { SearchPipe } from './pipes/search.pipe';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsTypePipe } from './pipes/is-type.pipe';
import { ImageDirective } from './file-upload/image.directive';
import { DialogComponent } from './dialog/dialog.component';
import { DefaultImageDirective } from './file-upload/default-image.directive';
import { MatErrorControlDirective } from './custom-material/mat-error-control.directive';
import { ReplaceParamsPipe } from './pipes/replace-params.pipe';
import { StartCasePipe } from './pipes/start-case.pipe';
import { IsFollowingPipe } from './pipes/auth/is-following.pipe';
import { IsSameAsLoggedPipe } from './pipes/auth/is-same-as-logged.pipe';
import { MatIconSvgDirective } from './custom-material/mat-icon-svg.directive';
import { ImgBackgroundDirective } from './file-upload/img-background.directive';
import { ScorePipe } from './pipes/score.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconSizeDirective } from './custom-material/mat-icon-size.directive';
import { FindPipe } from './pipes/find.pipe';
import { AssertNumberPipe } from './pipes/assert-number.pipe';
import { StUtilsModule } from '@stlmpp/utils';
import { MatFileUploadComponent } from './custom-material/mat-file-upload/mat-file-upload.component';
import { MatPaginatorDirective } from './custom-material/mat-paginator.directive';
import { FormatCharWrPipe } from './pipes/format-char-wr.pipe';
import { MatRowActiveDirective } from './custom-material/mat-row-active.directive';

const PIPES = [
  FilterPipe,
  SearchPipe,
  IsTypePipe,
  ReplaceParamsPipe,
  StartCasePipe,
  IsFollowingPipe,
  IsSameAsLoggedPipe,
  ScorePipe,
  FindPipe,
  AssertNumberPipe,
  FormatCharWrPipe,
];
const DIRECTIVES = [
  DisabledControlDirective,
  LetDirective,
  MatDialogActionsAlignDirective,
  MatListActiveDirective,
  DefaultImageDirective,
  MatErrorControlDirective,
  ImageDirective,
  MatIconSvgDirective,
  MatIconSizeDirective,
  ImgBackgroundDirective,
  MatPaginatorDirective,
  MatRowActiveDirective,
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
  MatBadgeModule,
  MatTooltipModule,
];

const COMPONENTS = [DialogComponent, MatFileUploadComponent];

@NgModule({
  imports: [...MODULES, StUtilsModule],
  declarations: [...PIPES, ...DIRECTIVES, ...COMPONENTS],
  exports: [...MODULES, ...PIPES, ...DIRECTIVES, ...COMPONENTS],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
