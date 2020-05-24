import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { UserQuery } from '../../../state/user/user.query';
import { RouterQuery } from '@stlmpp/router';
import { DefaultQuery } from '../../../state/default/default.query';
import { UserService } from '../../../state/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthQuery } from '../../../auth/state/auth.query';
import { SiteService } from '../../../state/site/site.service';
import { RouteParamEnum } from '../../../model/route-param.enum';
import {
  filter,
  finalize,
  map,
  pluck,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { User } from '../../../model/user';
import { trackByUserLink, UserLink } from '../../../model/user-link';
import { MatDialog } from '@angular/material/dialog';
import { UserLinkComponent } from './add-link/user-link.component';
import { WINDOW } from '../../../core/window.service';
import {
  Overlay,
  OverlayRef,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  trackByUserFollower,
  UserFollower,
} from '../../../model/user-follower';
import { UserFollowerService } from '../../../state/user-follower/user-follower.service';
import {
  FollowersComponent,
  UserFollowersData,
} from './followers/followers.component';
import { UserLinkService } from '../../../state/user-link/user-link.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent implements OnInit, OnDestroy {
  constructor(
    private userQuery: UserQuery,
    private routerQuery: RouterQuery,
    public defaultQuery: DefaultQuery,
    public changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private authQuery: AuthQuery,
    private matDialog: MatDialog,
    @Inject(WINDOW) public window: Window,
    private site: SiteService,
    private overlay: Overlay,
    private scrollStrategyOptions: ScrollStrategyOptions,
    private viewContainerRef: ViewContainerRef,
    private userFollowerService: UserFollowerService,
    private userLinkService: UserLinkService
  ) {}

  private _destroy$ = new Subject();

  @ViewChild('editOverlayRef', { read: TemplateRef })
  editTemplate: TemplateRef<any>;

  @ViewChild('card', { read: ElementRef }) cardRef: ElementRef;

  private overlayRef: OverlayRef;
  userFollowersLoading = true;
  userFollowingLoading = true;
  followingLoading = false;

  user$ = this.routerQuery.selectParams(RouteParamEnum.idUser).pipe(
    map(Number),
    switchMap(idUser => this.userQuery.selectEntity(idUser))
  );

  idDefaultAvatar$: Observable<number> = this.defaultQuery.idAvatar$;
  isSameAsLogged$ = this.user$.pipe(
    filter(user => !!user),
    pluck('id'),
    switchMap(idUser => this.authQuery.isSameAsLogged$(idUser))
  );
  isAdmin$ = this.authQuery.isAdmin$;

  trackByUserLink = trackByUserLink;
  trackByUserFollower = trackByUserFollower;

  uploadAvatar(user: User, $event: Event): void {
    if (user.uploading) return;
    const file = ($event.target as HTMLInputElement).files[0];
    if (!file) return;
    this.userService.uploadAvatar(user.id, file).subscribe(() => {
      this.matSnackBar.open('Avatar updated', 'Close');
    });
  }

  openLink(user: User, userLink?: UserLink): void {
    this.matDialog.open(UserLinkComponent, { data: { user, userLink } });
  }

  redirectLink(userLink: UserLink): void {
    this.window.open(
      this.site.handleUrl(userLink.site, userLink.url, 'user'),
      '_blank'
    );
  }

  deleteLink(userLink: UserLink): void {
    this.userLinkService.delete(userLink.id).subscribe();
  }

  openEdit(
    element: HTMLElement,
    field: keyof User,
    type: 'input' | 'textarea' = 'input',
    maxlength?: number
  ): void {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        scrollStrategy: this.scrollStrategyOptions.block(),
        panelClass: ['app-user-card', 'edit-overlay'],
        width: this.cardRef.nativeElement.getBoundingClientRect().width,
      });
    }
    this.overlayRef.updatePositionStrategy(
      this.overlay
        .position()
        .flexibleConnectedTo(element)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 5,
          },
        ])
    );
    this.overlayRef.attach(
      new TemplatePortal(this.editTemplate, this.viewContainerRef, {
        field,
        type,
        maxlength,
      })
    );
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.overlayRef.detach();
      });
  }

  edit(user: User, field: keyof User, newValue: User[keyof User]): void {
    this.userService.update(user.id, { [field]: newValue }).subscribe(() => {
      this.overlayRef.detach();
    });
  }

  onFollow(user: User): void {
    this.followingLoading = true;
    this.userFollowerService
      .followUnfollow(user)
      .pipe(
        finalize(() => {
          this.followingLoading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  seeAllFollowers(
    type: keyof Pick<UserFollower, 'follower' | 'followed'>
  ): void {
    const list = this.user$.pipe(
      pluck(type === 'follower' ? 'userFollowers' : 'userFollowed'),
      map(followers => followers.map(follower => follower[type]))
    );
    const title = type === 'follower' ? 'Followers' : 'Following';
    this.matDialog.open(FollowersComponent, {
      data: { title, list$: list, type } as UserFollowersData,
    });
  }

  ngOnInit(): void {
    this.routerQuery
      .selectParams<string>(RouteParamEnum.idUser)
      .pipe(
        filter(idUser => !!idUser),
        map(Number)
      )

      .pipe(
        switchMap(idUser =>
          forkJoin([
            this.userFollowerService.findByParams({ idFollower: idUser }).pipe(
              finalize(() => {
                this.userFollowersLoading = false;
              })
            ),
            this.userFollowerService.findByParams({ idFollowed: idUser }).pipe(
              finalize(() => {
                this.userFollowingLoading = false;
              })
            ),
          ]).pipe(
            finalize(() => {
              this.changeDetectorRef.markForCheck();
            })
          )
        )
      )
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
