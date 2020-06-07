import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterQuery } from '@stlmpp/router';
import { UserQuery } from '../../state/user/user.query';
import { RouteParamEnum } from '../../model/route-param.enum';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { AuthQuery } from '../../auth/state/auth.query';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  constructor(private routerQuery: RouterQuery, private userQuery: UserQuery, private authQuery: AuthQuery) {}

  user$ = this.routerQuery.selectParams(RouteParamEnum.idUser).pipe(
    map(Number),
    switchMap(idUser => this.userQuery.selectEntity(idUser))
  );

  isSameAsLogged$ = this.user$.pipe(
    filter(user => !!user),
    pluck('id'),
    switchMap(idUser => this.authQuery.isSameAsLogged$(idUser))
  );

  ngOnInit(): void {}
}
