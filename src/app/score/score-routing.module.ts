import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitScoreAlphaComponent } from './submit-score-alpha/submit-score-alpha.component';
import { GameResolver } from '../state/game/game.resolver';
import { ModeResolver } from '../state/mode/mode.resolver';
import { PlatformResolver } from '../state/platform/platform.resolver';
import { TypeResolver } from '../state/type/type.resolver';
import { StageResolver } from '../state/stage/stage.resolver';
import { CharacterResolver } from '../state/character/character.resolver';

const routes: Routes = [
  {
    path: 'submit',
    component: SubmitScoreAlphaComponent,
    resolve: [
      GameResolver,
      ModeResolver,
      PlatformResolver,
      TypeResolver,
      StageResolver,
      CharacterResolver,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRoutingModule {}
