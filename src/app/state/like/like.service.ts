import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import { Like, LikeAddDto, LikeCount, LikeDeleteDto, LikeParamsDto, LikeUpdateDto } from '../../model/like';
import { HttpClient } from '@angular/common/http';
import { LikeStore } from './like.store';
import { LikeQuery } from './like.query';
import { Observable } from 'rxjs';
import { ReferenceTypeEnum } from '../../model/reference-type.enum';
import { HttpParams } from '../../util/http-params';

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
  constructor(private http: HttpClient, private likeStore: LikeStore, private likeQuery: LikeQuery) {
    super({
      http,
      store: likeStore,
      query: likeQuery,
      options: {
        endPoint: 'like',
        excludeMethods: ['findAll'],
      },
    });
  }

  findCountForAll(type: ReferenceTypeEnum, idReference: number): Observable<LikeCount> {
    const params = new HttpParams({ type, idReference });
    return this.http.get<LikeCount>(`${this.endPoint}/count-all`, {
      params,
    });
  }
}
