import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import {
  Like,
  LikeAddDto,
  LikeDeleteDto,
  LikeParamsDto,
  LikeUpdateDto,
} from '../../model/like';
import { HttpClient } from '@angular/common/http';
import { LikeStore } from './like.store';
import { LikeQuery } from './like.query';

@Injectable({ providedIn: 'root' })
export class LikeService extends SuperService<
  Like,
  LikeAddDto,
  LikeUpdateDto,
  LikeParamsDto,
  LikeParamsDto,
  LikeDeleteDto,
  LikeParamsDto
> {
  constructor(
    private http: HttpClient,
    private likeStore: LikeStore,
    private likeQuery: LikeQuery
  ) {
    super(http, likeStore, likeQuery, {
      endPoint: 'like',
      excludeMethods: ['findAll'],
    });
  }
}
