import { ModuleWithProviders, NgModule } from '@angular/core';
import { DefaultPipe } from './default/default.pipe';
import { FilterPipe } from './filter/filter.pipe';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsTypePipe } from './is-type/is-type.pipe';
import { ImageDirective } from './file-upload/image.directive';
import { DialogComponent } from './dialog/dialog.component';
import { DefaultImageDirective } from './default/default-image.directive';
import { MatErrorControlDirective } from './custom-material/mat-error-control.directive';
import { ReplaceParamsPipe } from './replace-params/replace-params.pipe';
import { StartCasePipe } from './start-case/start-case.pipe';
import { BadgeComponent } from './badge/badge.component';
import { IsFollowingPipe } from './auth-pipes/is-following.pipe';
import { IsSameAsLoggedPipe } from './auth-pipes/is-same-as-logged.pipe';
import { MatIconSvgDirective } from './custom-material/mat-icon-svg.directive';
import { ImgBackgroundDirective } from './img-background/img-background.directive';
import { ScorePipe } from './pipes/score.pipe';
import { LikeComponent } from './like/like.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconSizeDirective } from './custom-material/mat-icon-size.directive';
import { FindPipe } from './find/find.pipe';
import { AssertNumberPipe } from './assert/assert-number.pipe';

const PIPES = [
  DefaultPipe,
  FilterPipe,
  SearchPipe,
  SumByPipe,
  IsTypePipe,
  ReplaceParamsPipe,
  StartCasePipe,
  IsFollowingPipe,
  IsSameAsLoggedPipe,
  ScorePipe,
  FindPipe,
  AssertNumberPipe,
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

const COMPONENTS = [DialogComponent, BadgeComponent, LikeComponent];

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
