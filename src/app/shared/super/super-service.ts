import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { catchHttpError } from '../../util/operators/catchError';
import { HttpParams } from '../../util/http-params';
import { FileUpload } from '../../model/file-upload';
import { CommonColumns } from '../../model/common-history';
import { EntityQuery, EntityStore, useCache } from '@stlmpp/store';

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
  | 'deleteByParams'
  | 'count';

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

export interface SuperServiceContructor<Entity extends CommonColumns> {
  http: HttpClient;
  store?: EntityStore<Entity>;
  query?: EntityQuery<Entity>;
  options?: SuperServiceOptions<Entity>;
}

export class SuperService<
  Entity extends CommonColumns,
  AddDto = any,
  UpdateDto = any,
  ExistsDto = any,
  ParamsDto = any,
  DeleteDto = any,
  CountDto = any
> {
  constructor(http: HttpClient, options: SuperServiceOptions<Entity>);
  constructor(paramaters: SuperServiceContructor<Entity>);
  constructor(
    parameters: SuperServiceContructor<Entity> | HttpClient,
    options?: SuperServiceOptions<Entity>
  ) {
    if (parameters instanceof HttpClient) {
      this.__http = parameters;
      this.setOptions(options);
    } else {
      this.__http = parameters.http;
      this.__store = parameters.store;
      this.__query = parameters.query;
      this.setOptions(parameters.options);
    }
  }

  private readonly __http: HttpClient;
  private readonly __store: EntityStore<Entity>;
  private readonly __query: EntityQuery<Entity>;

  private __options: SuperServiceOptions<Entity>;

  get endPoint(): string {
    return this.__options.endPoint;
  }

  private setOptions(options: SuperServiceOptions<Entity>): void {
    this.__options = {
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
    if (!this.__options.endPoint.startsWith('/')) {
      this.__options.endPoint = '/' + this.__options.endPoint;
    }
  }

  private isAllowed(method: SuperServiceMethod): boolean {
    const notAllowed = this.__options.excludeMethods.includes(method);
    if (notAllowed) {
      throw new Error(`Method ${method} is not allowed`);
    }
    return !notAllowed;
  }

  add(dto: AddDto): Observable<Entity> {
    if (this.isAllowed('add')) {
      return this.__http.post<Entity>(this.__options.endPoint, dto).pipe(
        tap(entity => {
          this.__store?.add(entity);
        })
      );
    }
  }

  addMany(dto: AddDto[]): Observable<Entity[]> {
    if (this.isAllowed('addMany')) {
      return this.__http.post<Entity[]>(`${this.__options.endPoint}/batch`, dto).pipe(
        tap(entities => {
          this.__store?.add(entities);
        })
      );
    }
  }

  update(id: number, dto: UpdateDto): Observable<Entity> {
    if (this.isAllowed('update')) {
      this.__store?.update(id, { saving: true } as Partial<Entity>);
      let http = this.__http.patch<Entity>(`${this.__options.endPoint}/${id}`, dto);
      if (this.__options.updateTime === 'before' && !!this.__store && !!this.__query) {
        if (this.__options.updateError === 'restore') {
          const originalEntity = this.__query.getEntity(id);
          http = http.pipe(
            catchHttpError(() => {
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
            this.__store?.update(id, entity);
          }),
          finalize(() => {
            this.__store?.update(id, { saving: false } as any);
          })
        );
      }
    }
  }

  delete(id: number): Observable<Entity[]> {
    if (this.isAllowed('delete')) {
      this.__store?.update(id, { deleting: true } as any);
      let http = this.__http.delete<Entity[]>(`${this.__options.endPoint}/${id}`);
      if (this.__options.deleteTime === 'before' && !!this.__store && !!this.__query) {
        if (this.__options.deleteError === 'restore') {
          const originalEntity = this.__query.getEntity(id);
          http = http.pipe(
            catchHttpError(() => {
              this.__store.add({ ...originalEntity, deleting: false });
            })
          );
        }
        this.__store.remove(id);
        return http;
      } else {
        return http.pipe(
          tap(() => {
            this.__store?.remove(id);
          }),
          catchHttpError(() => {
            this.__store?.update(id, { deleting: false } as any);
          })
        );
      }
    }
  }

  deleteByParams(dto: DeleteDto): Observable<Entity[]> {
    if (this.isAllowed('deleteByParams')) {
      return this.__http
        .request<Entity[]>('delete', this.__options.endPoint, { body: dto })
        .pipe(
          tap(deleteds => {
            this.__store?.remove(deleteds.map(entity => entity.id));
          })
        );
    }
  }

  exists(dto: ExistsDto): Observable<boolean> {
    if (this.isAllowed('exists')) {
      return this.__http.post<boolean>(`${this.__options.endPoint}/exists`, dto);
    }
  }

  findAll(): Observable<Entity[]> {
    if (this.isAllowed('findAll')) {
      const http$ = this.__http.get<Entity[]>(this.__options.endPoint).pipe(
        tap(entities => {
          this.__store?.set(entities);
        })
      );
      if (this.__options.cache && !!this.__store) {
        return http$.pipe(useCache(this.__store));
      } else {
        return http$;
      }
    }
  }

  findById(id: number): Observable<Entity> {
    if (this.isAllowed('findById')) {
      return this.__http.get<Entity>(`${this.__options.endPoint}/${id}`).pipe(
        tap(entity => {
          this.__store?.upsert(id, entity);
        })
      );
    }
  }

  findByParams(dto: ParamsDto, limit?: number): Observable<Entity[]> {
    if (this.isAllowed('findByParams')) {
      const params = new HttpParams({ limit }, true);
      return this.__http
        .post<Entity[]>(`${this.__options.endPoint}/params`, dto, { params })
        .pipe(
          tap(entities => {
            this.__store?.upsert(entities);
          })
        );
    }
  }

  findOneByParams(dto: ParamsDto): Observable<Entity> {
    return this.__http.post<Entity>(`${this.__options.endPoint}/one-params`, dto).pipe(
      tap(entity => {
        if (entity?.id) {
          this.__store?.upsert(entity.id, entity);
        }
      })
    );
  }

  countByParams(dto: CountDto): Observable<number> {
    if (this.isAllowed('count')) {
      return this.__http.post<number>(`${this.__options.endPoint}/count`, dto);
    }
  }

  search(term: string): Observable<Entity[]> {
    if (this.isAllowed('search')) {
      const params = new HttpParams({ term });
      return this.__http
        .get<Entity[]>(`${this.__options.endPoint}/search`, { params })
        .pipe(
          tap(entities => {
            this.__store?.upsert(entities);
          })
        );
    }
  }

  uploadFile(id: number, file: File): Observable<FileUpload> {
    if (!this.__options.file) {
      throw new Error('Method uploadFile is not allowed');
    }
    this.__store?.update(id, { uploading: true } as Partial<Entity>);
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.__http
      .patch<FileUpload>(`${this.__options.endPoint}/${id}/file`, formData, {
        headers,
      })
      .pipe(
        tap(fileUpload => {
          this.__store?.update(id, {
            [this.__options.file.idKey]: fileUpload.id,
            [this.__options.file.key]: fileUpload,
            uploading: false,
          } as any);
        }),
        catchHttpError(() => {
          this.__store?.update(id, { uploading: false } as any);
        })
      );
  }
}
