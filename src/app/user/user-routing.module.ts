import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParamEnum } from '../model/route-param.enum';
import { ProfileComponent } from './profile/profile.component';
import { SingleUserResolver } from '../state/user/user.resolver';
import { UserLinkResolver } from '../state/user-link/user-link.resolver';

const routes: Routes = [
  {
    path: `:${RouteParamEnum.idUser}/profile`,
    component: ProfileComponent,
    resolve: [SingleUserResolver, UserLinkResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
