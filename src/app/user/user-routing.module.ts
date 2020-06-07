import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParamEnum } from '../model/route-param.enum';
import { ProfileComponent } from './profile/profile.component';
import { SingleUserResolver, UserLikeResolver } from '../state/user/user.resolver';
import { PlatformResolver } from '../state/platform/platform.resolver';
import { RegionResolver } from '../state/region/region.resolver';
import { ReasonResolver } from '../state/reason/reason.resolver';

const routes: Routes = [
  {
    path: `:${RouteParamEnum.idUser}/profile`,
    component: ProfileComponent,
    resolve: [SingleUserResolver, PlatformResolver, RegionResolver, UserLikeResolver, ReasonResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
