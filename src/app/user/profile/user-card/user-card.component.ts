import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UserQuery } from '../../../state/user/user.query';
import { RouterQuery } from '@stlmpp/router';
import { DefaultQuery } from '../../../state/default/default.query';
import { UserService } from '../../../state/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthQuery } from '../../../auth/state/auth.query';
import { SiteService } from '../../../state/site/site.service';
import { RouteParamEnum } from '../../../model/route-param.enum';
import { filter, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { User, UserUpdateDto } from '../../../model/user';
import { trackByUserLink, UserLink } from '../../../model/user-link';
import { MatDialog } from '@angular/material/dialog';
import { UserLinkComponent } from './add-link/user-link.component';
import { WINDOW } from '../../../core/window.service';
import { Overlay, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { trackByUserFollower, UserFollower } from '../../../model/user-follower';
import { UserFollowerService } from '../../../state/user-follower/user-follower.service';
import { FollowersComponent, UserFollowersData } from './followers/followers.component';
import { UserLinkService } from '../../../state/user-link/user-link.service';
import { Region } from '../../../model/region';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ReferenceTypeEnum } from '../../../model/reference-type.enum';
import { ReasonQuery } from '../../../state/reason/reason.query';
import {
  RegionModalOptions,
  SelectRegionComponent,
} from '../../../shared/region/select-region/select-region.component';

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
    public authQuery: AuthQuery,
    private matDialog: MatDialog,
    @Inject(WINDOW) public window: Window,
    private site: SiteService,
    private overlay: Overlay,
    private scrollStrategyOptions: ScrollStrategyOptions,
    private viewContainerRef: ViewContainerRef,
    private userFollowerService: UserFollowerService,
    private userLinkService: UserLinkService,
    public reasonQuery: ReasonQuery
  ) {}

  private _destroy$ = new Subject();

  referenceTypeEnum = ReferenceTypeEnum;

  @Input() user: User;
  @Input() isSameAsLogged: boolean;

  @ViewChild('editOverlayRef', { read: TemplateRef })
  editTemplate: TemplateRef<any>;

  @ViewChild('card', { read: ElementRef }) cardRef: ElementRef;

  private overlayRef: OverlayRef;
  userFollowersLoading: boolean;
  userFollowingLoading: boolean;
  followingLoading: boolean;

  idDefaultAvatar$: Observable<number> = this.defaultQuery.idAvatar$;
  approvalCount$ = this.routerQuery.selectData<number>('5');

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

  addOrEditLink(user: User, userLink?: UserLink): void {
    this.matDialog.open(UserLinkComponent, {
      data: { user, userLink },
    });
  }

  redirectLink(userLink: UserLink): void {
    this.window.open(this.site.handleUrl(userLink.site, userLink.url, 'user'), '_blank');
  }

  deleteLink(userLink: UserLink): void {
    this.userLinkService.delete(userLink.id).subscribe();
  }

  openRegion(): void {
    this.matDialog
      .open(SelectRegionComponent, {
        width: '500px',
        height: '600px',
        data: {
          idRegion: this.user.idRegion,
          title: 'Choose your region',
        } as RegionModalOptions,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((region: Region) => {
        if (region) {
          this.edit('idRegion', region.id);
        }
      });
  }

  openEditOther(): void {
    this.matDialog.open(EditInfoComponent, { data: this.user });
  }

  openEdit(
    element: HTMLElement,
    field: keyof UserUpdateDto,
    type: 'input' | 'textarea' = 'input',
    maxlength?: number
  ): void {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        scrollStrategy: this.scrollStrategyOptions.block(),
        panelClass: ['app-user-card', 'edit-overlay'],
        minWidth: 400,
        maxWidth: 600,
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

  edit<K extends keyof UserUpdateDto>(field: K, newValue: UserUpdateDto[K]): void {
    this.userService.update(this.user.id, { [field]: newValue }).subscribe(() => {
      this.overlayRef?.detach();
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

  seeAllFollowers(type: keyof Pick<UserFollower, 'follower' | 'followed'>): void {
    const title = type === 'follower' ? 'Followers' : 'Following';
    this.matDialog.open(FollowersComponent, {
      data: { title, idUser: this.user.id, type } as UserFollowersData,
    });
  }

  ngOnInit(): void {
    this.routerQuery
      .selectParams<string>(RouteParamEnum.idUser)
      .pipe(
        takeUntil(this._destroy$),
        filter(idUser => !!idUser),
        map(Number),
        tap(() => {
          this.userFollowersLoading = true;
          this.userFollowingLoading = true;
        }),
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
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.overlayRef?.dispose();
  }
}
