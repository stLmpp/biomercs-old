import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { trackByUser, User } from '../../../../model/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DefaultQuery } from '../../../../state/default/default.query';
import { UserFollower } from '../../../../model/user-follower';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthQuery } from '../../../../auth/state/auth.query';
import { UserFollowerService } from '../../../../state/user-follower/user-follower.service';

export interface UserFollowersData {
  title: string;
  list$: Observable<User[]>;
  type: keyof Pick<UserFollower, 'follower' | 'followed'>;
}

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowersComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserFollowersData,
    public defaultQuery: DefaultQuery,
    private router: Router,
    private matDialogRef: MatDialogRef<FollowersComponent>,
    public authQuery: AuthQuery,
    private userFollowerService: UserFollowerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  trackBy = trackByUser;

  loadingState: { [id: number]: boolean } = {};

  onFollow(user: User): void {
    this.loadingState = { ...this.loadingState, [user.id]: true };
    this.userFollowerService
      .followUnfollow(user)
      .pipe(
        finalize(() => {
          this.loadingState = { ...this.loadingState, [user.id]: false };
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  navigateToUser(idUser: number): void {
    this.matDialogRef.close();
    this.router.navigate(['/user', idUser, 'profile']);
  }

  ngOnInit(): void {}
}
