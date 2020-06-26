import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParamEnum } from '../model/route-param.enum';
import { ProfileComponent } from './profile/profile.component';
import { SingleUserResolver, UserLikeResolver } from '../state/user/user.resolver';
import { PlatformResolver } from '../state/platform/platform.resolver';
import { RegionResolver } from '../state/region/region.resolver';
import { ReasonResolver } from '../state/reason/reason.resolver';
import { UserScoreApprovalComponent } from './user-score-approval/user-score-approval.component';
import { SameAsLoggedGuard } from '../auth/same-as-logged.guard';
import { ScoreCountApprovalResolver } from './score-count-approval.resolver';
import { SiteResolver } from '../state/site/site.resolver';

const routes: Routes = [
  {
    path: `:${RouteParamEnum.idUser}`,
    children: [
      {
        path: `profile`,
        component: ProfileComponent,
        resolve: [
          SingleUserResolver,
          PlatformResolver,
          RegionResolver,
          UserLikeResolver,
          ReasonResolver,
          ScoreCountApprovalResolver,
        ],
      },
      {
        path: 'score-approval',
        component: UserScoreApprovalComponent,
        resolve: [PlatformResolver, SiteResolver],
        canActivate: [SameAsLoggedGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
