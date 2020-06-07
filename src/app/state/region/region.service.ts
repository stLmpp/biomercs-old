import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import { Region, RegionAddDto, RegionExistsDto, RegionUpdateDto } from '../../model/region';
import { HttpClient } from '@angular/common/http';
import { RegionStore } from './region.store';
import { RegionQuery } from './region.query';

@Injectable({ providedIn: 'root' })
export class RegionService extends SuperService<
  Region,
  RegionAddDto,
  RegionUpdateDto,
  RegionExistsDto,
  RegionExistsDto
> {
  constructor(private http: HttpClient, private regionStore: RegionStore, private regionQuery: RegionQuery) {
    super({
      http,
      store: regionStore,
      query: regionQuery,
      options: { endPoint: 'region' },
    });
  }
}
