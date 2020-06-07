import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ReferenceTypeEnum } from '../../model/reference-type.enum';
import { LikeService } from '../../state/like/like.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, finalize, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthQuery } from '../../auth/state/auth.query';
import { Like, LikeStyleEnum } from '../../model/like';
import { convertToBoolProperty } from '../../util/util';
import { LikeQuery } from '../../state/like/like.query';

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
    private changeDetectorRef: ChangeDetectorRef,
    private likeQuery: LikeQuery
  ) {}

  likeStyleEnum = LikeStyleEnum;
  saving = false;
  loadingCount = false;
  loadingLike = false;

  params$ = new BehaviorSubject<LikeParams>(null);
  updateCount$ = new BehaviorSubject<void>(null);

  @Input() type: ReferenceTypeEnum;
  @Input() idReference: number;

  @Input('readonly')
  set _readonly(value: '' | boolean) {
    this.readonly = convertToBoolProperty(value);
  }
  readonly: boolean;

  likeCount$ = combineLatest([this.params$.asObservable(), this.updateCount$.asObservable()]).pipe(
    map(([params]) => params),
    filter(params => !!(params?.idReference && params?.type)),
    switchMap(params => {
      this.loadingCount = true;
      return this.likeService.findCountForAll(params.type, params.idReference).pipe(
        finalize(() => {
          this.loadingCount = false;
        })
      );
    })
  );

  currentLike$ = this.params$.asObservable().pipe(
    filter(params => !!(params?.idReference && params?.type)),
    withLatestFrom(this.authQuery.user$),
    switchMap(([params, user]) => {
      return this.likeQuery.findOneByParams({
        type: params.type,
        createdBy: user.id,
        idReference: params.idReference,
      });
    })
  );

  addOrRemove(style: LikeStyleEnum, currentLike?: Like): void {
    if (this.readonly || this.saving || this.loadingLike || this.loadingCount) {
      return;
    }
    this.saving = true;
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
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.updateCount$.next();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const params = Object.entries(changes)
      .filter(([key]) => ['type', 'idReference'].includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value.currentValue }), {});
    this.params$.next({ ...this.params$.value, ...params });
  }

  ngOnInit(): void {}
}
