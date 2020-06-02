import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { ReferenceTypeEnum } from '../../model/reference-type.enum';
import { LikeService } from '../../state/like/like.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, finalize, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthQuery } from '../../auth/state/auth.query';
import { Like, LikeStyleEnum } from '../../model/like';

interface LikeParams {
  type: ReferenceTypeEnum;
  idReference: number;
}

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikeComponent implements OnInit, OnChanges {
  constructor(
    private likeService: LikeService,
    private authQuery: AuthQuery,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  likeStyleEnum = LikeStyleEnum;
  loading = false;

  params$ = new BehaviorSubject<LikeParams>(null);

  @Input() type: ReferenceTypeEnum;
  @Input() idReference: number;

  likeCount$ = this.params$.asObservable().pipe(
    filter(params => !!(params?.idReference && params?.type)),
    switchMap(params => this.likeService.countByParams(params))
  );

  currentLike$ = this.params$.asObservable().pipe(
    filter(params => !!(params?.idReference && params?.type)),
    withLatestFrom(this.authQuery.user$),
    switchMap(([params, user]) =>
      this.likeService.findOneByParams({
        type: params.type,
        createdBy: user.id,
        idReference: params.idReference,
      })
    )
  );

  addOrRemove(style: LikeStyleEnum, currentLike?: Like): void {
    this.loading = true;
    let http$: Observable<any>;
    if (currentLike) {
      if (currentLike.style === style) {
        http$ = this.likeService.delete(currentLike.id);
      } else {
        http$ = this.likeService.update(currentLike.id, { style });
      }
    } else {
      http$ = this.likeService.add({
        idReference: this.idReference,
        style,
        type: this.type,
      });
    }
    http$
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.params$.next(this.params$.value);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const params = Object.entries(changes)
      .filter(([key]) => ['type', 'idReference'].includes(key))
      .reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value.currentValue }),
        {}
      );
    this.params$.next({ ...this.params$.value, ...params });
  }

  ngOnInit(): void {}
}
