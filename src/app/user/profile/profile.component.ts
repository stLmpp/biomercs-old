import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UserQuery } from '../../state/user/user.query';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { RouteParamEnum } from '../../model/route-param.enum';
import { map, switchMap } from 'rxjs/operators';
import { DefaultQuery } from '../../state/default/default.query';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { UserService } from '../../state/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  constructor(
    private userQuery: UserQuery,
    private routerQuery: RouterQuery,
    public defaultQuery: DefaultQuery,
    public changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private matSnackBar: MatSnackBar
  ) {}

  user$ = this.routerQuery.selectParams(RouteParamEnum.idUser).pipe(
    map(Number),
    switchMap(idUser => this.userQuery.selectEntity(idUser))
  );

  idDefaultAvatar$: Observable<number> = this.defaultQuery.idAvatar$;

  uploadAvatar(user: User, $event: Event): void {
    if (user.uploading) return;
    const file = ($event.target as HTMLInputElement).files[0];
    if (!file) return;
    this.userService.uploadAvatar(user.id, file).subscribe(() => {
      this.matSnackBar.open('Avatar updated', 'Close');
    });
  }

  ngOnInit(): void {}
}
