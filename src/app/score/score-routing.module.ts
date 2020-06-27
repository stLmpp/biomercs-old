import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParamEnum } from '../model/route-param.enum';
import { ScoreComponent } from './score/score.component';
import { RandomScoreResolver, ScoreLikeResolver, SingleScoreResolver } from '../state/score/score.resolver';
import { ReasonResolver } from '../state/reason/reason.resolver';
import { SubmitComponent } from './submit/submit.component';
import { PlatformResolver } from '../state/platform/platform.resolver';
import { SiteResolver } from '../state/site/site.resolver';
import { ScoreGuard } from './score/score.guard';

const routes: Routes = [
  {
    path: 'random',
    resolve: [RandomScoreResolver],
  },
  {
    path: 'submit',
    component: SubmitComponent,
    resolve: [PlatformResolver, SiteResolver],
  },
  {
    path: `:${RouteParamEnum.idScore}`,
    component: ScoreComponent,
    resolve: [SingleScoreResolver, ScoreLikeResolver, ReasonResolver],
    canActivate: [ScoreGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRoutingModule {}
