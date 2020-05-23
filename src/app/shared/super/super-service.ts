import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { catchHttpError } from '../../util/operators/catchError';
import { HttpParams } from '../../util/http-params';
import { FileUpload } from '../../model/file-upload';
import { CommonColumns } from '../../model/common-history';
import { EntityQuery, EntityStore, useCache } from 'st-store';

export type SuperServiceMethod =
  | 'add'
  | 'addMany'
  | 'delete'
  | 'findAll'
  | 'findById'
  | 'update'
  | 'exists'
  | 'findByParams'
  | 'search'
  | 'deleteByParams';

export type SuperServiceTime = 'after' | 'before';
export type SuperServiceErrorAction = 'restore' | 'keep';

export interface SuperServiceOptions<Entity> {
  endPoint: string;
  excludeMethods?: SuperServiceMethod[];
  updateTime?: SuperServiceTime;
  updateError?: SuperServiceErrorAction;
  deleteTime?: SuperServiceTime;
  deleteError?: SuperServiceErrorAction;
  file?: {
    idKey?: keyof Entity;
    key?: keyof Entity;
  };
  cache?: boolean;
}

export class SuperService<
  Entity extends CommonColumns,
  AddDto = any,
  UpdateDto = any,
  ExistsDto = any,
  ParamsDto = any,
  DeleteDto = any
> {
  constructor(
    private __http: HttpClient,
    private __store: EntityStore<Entity>,
    private __query: EntityQuery<Entity>,
    options: SuperServiceOptions<Entity>
  ) {
    this.options = {
      ...{
        excludeMethods: [],
        updateTime: 'after',
        updateError: 'restore',
        deleteTime: 'after',
        deleteError: 'restore',
        cache: true,
      },
      ...options,
    };
    if (!this.options.endPoint.startsWith('/')) {
      this.options.endPoint = '/' + this.options.endPoint;
    }
  }

  private options: SuperServiceOptions<Entity>;

  private isAllowed(method: SuperServiceMethod): boolean {
    const notAllowed = this.options.excludeMethods.includes(method);
    if (notAllowed) {
      throw new Error(`Method ${method} is not allowed`);
    }
    return !notAllowed;
  }

  add(dto: AddDto): Observable<Entity> {
    if (this.isAllowed('add')) {
      return this.__http.post<Entity>(this.options.endPoint, dto).pipe(
        tap(entity => {
          this.__store.add(entity);
        })
      );
    }
  }

  addMany(dto: AddDto[]): Observable<Entity[]> {
    if (this.isAllowed('addMany')) {
      return this.__http
        .post<Entity[]>(`${this.options.endPoint}/batch`, dto)
        .pipe(
          tap(entities => {
            this.__store.add(entities);
          })
        );
    }
  }

  update(id: number, dto: UpdateDto): Observable<Entity> {
    if (this.isAllowed('update')) {
      this.__store.update(id, { saving: true } as Partial<Entity>);
      let http = this.__http.patch<Entity>(
        `${this.options.endPoint}/${id}`,
        dto
      );
      if (this.options.updateTime === 'before') {
        if (this.options.updateError === 'restore') {
          const originalEntity = this.__query.getEntity(id);
          http = http.pipe(
            catchHttpError(err => {
              this.__store.replace(id, { ...originalEntity, saving: false });
            })
          );
        }
        this.__store.update(id, dto);
        return http.pipe(
          tap(entity => {
            this.__store.update(id, entity);
          })
        );
      } else {
        return http.pipe(
          tap(entity => {
            this.__store.update(id, entity);
          }),
          finalize(() => {
            this.__store.update(id, { saving: false } as any);
          })
        );
      }
    }
  }

  delete(id: number): Observable<Entity[]> {
    if (this.isAllowed('delete')) {
      this.__store.update(id, { deleting: true } as any);
      let http = this.__http.delete<Entity[]>(`${this.options.endPoint}/${id}`);
      if (this.options.deleteTime === 'before') {
        if (this.options.deleteError === 'restore') {
          const originalEntity = this.__query.getEntity(id);
          http = http.pipe(
            catchHttpError(err => {
              this.__store.add({ ...originalEntity, deleting: false });
            })
          );
        }
        this.__store.remove(id);
        return http;
      } else {
        return http.pipe(
          tap(() => {
            this.__store.remove(id);
          }),
          catchHttpError(err => {
            this.__store.update(id, { deleting: false } as any);
          })
        );
      }
    }
  }

  deleteByParams(dto: DeleteDto): Observable<Entity[]> {
    if (this.isAllowed('deleteByParams')) {
      return this.__http
        .request<Entity[]>('delete', this.options.endPoint, { body: dto })
        .pipe(
          tap(deleteds => {
            this.__store.remove(deleteds.map(entity => entity.id));
          })
        );
    }
  }

  exists(dto: ExistsDto): Observable<boolean> {
    if (this.isAllowed('exists')) {
      return this.__http.post<boolean>(`${this.options.endPoint}/exists`, dto);
    }
  }

  findAll(): Observable<Entity[]> {
    if (this.isAllowed('findAll')) {
      const http$ = this.__http.get<Entity[]>(this.options.endPoint).pipe(
        tap(entities => {
          this.__store.set(entities);
        })
      );
      if (this.options.cache) {
        return http$.pipe(useCache(this.__store));
      } else {
        return http$;
      }
    }
  }

  findById(id: number): Observable<Entity> {
    if (this.isAllowed('findById')) {
      return this.__http.get<Entity>(`${this.options.endPoint}/${id}`).pipe(
        tap(entity => {
          this.__store.update(id, entity);
        })
      );
    }
  }

  findByParams(dto: ParamsDto, limit?: number): Observable<Entity[]> {
    if (this.isAllowed('findByParams')) {
      const params = new HttpParams({ limit }, true);
      return this.__http
        .post<Entity[]>(`${this.options.endPoint}/params`, dto, { params })
        .pipe(
          tap(entities => {
            this.__store.upsert(entities);
          })
        );
    }
  }

  search(term: string): Observable<Entity[]> {
    if (this.isAllowed('search')) {
      const params = new HttpParams({ term });
      return this.__http
        .get<Entity[]>(`${this.options.endPoint}/search`, { params })
        .pipe(
          tap(entities => {
            this.__store.upsert(entities);
          })
        );
    }
  }

  uploadFile(id: number, file: File): Observable<FileUpload> {
    if (!this.options.file) {
      throw new Error('Method uploadFile is now allowed');
    }
    this.__store.update(id, { uploading: true } as Partial<Entity>);
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.__http
      .patch<FileUpload>(`${this.options.endPoint}/${id}/file`, formData, {
        headers,
      })
      .pipe(
        tap(fileUpload => {
          this.__store.update(id, {
            [this.options.file.idKey]: fileUpload.id,
            [this.options.file.key]: fileUpload,
            uploading: false,
          } as any);
        }),
        catchHttpError(err => {
          this.__store.update(id, { uploading: false } as any);
        })
      );
  }
}
