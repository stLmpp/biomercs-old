import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformStore } from './platform.store';
import { PlatformQuery } from './platform.query';
import { SuperService } from '../../shared/super/super-service';
import {
  Platform,
  PlatformAddDto,
  PlatformUpdateDto,
} from '../../model/platform';

@Injectable({ providedIn: 'root' })
export class PlatformService extends SuperService<
  Platform,
  PlatformAddDto,
  PlatformUpdateDto,
  PlatformUpdateDto,
  PlatformUpdateDto
> {
  constructor(
    private platformStore: PlatformStore,
    private http: HttpClient,
    private platformQuery: PlatformQuery
  ) {
    super(http, platformStore, platformQuery, {
      endPoint: 'platform',
      file: {
        idKey: 'idLogo',
        key: 'logo',
      },
    });
  }
}
