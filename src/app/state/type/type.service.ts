import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TypeStore } from './type.store';
import { TypeQuery } from './type.query';
import { Type, TypeAddDto, TypeExistsDto, TypeParamsDto, TypeUpdateDto } from '../../model/type';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class TypeService extends SuperService<Type, TypeAddDto, TypeUpdateDto, TypeExistsDto, TypeParamsDto> {
  constructor(private typeStore: TypeStore, private http: HttpClient, private typeQuery: TypeQuery) {
    super({
      http,
      store: typeStore,
      query: typeQuery,
      options: {
        endPoint: 'type',
      },
    });
  }
}
