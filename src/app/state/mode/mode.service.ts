import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModeStore } from './mode.store';
import {
  Mode,
  ModeAddDto,
  ModeExistsDto,
  ModeParamsDto,
  ModeUpdateDto,
} from '../../model/mode';
import { SuperService } from '../../shared/super/super-service';
import { ModeQuery } from './mode.query';

@Injectable({ providedIn: 'root' })
export class ModeService extends SuperService<
  Mode,
  ModeAddDto,
  ModeUpdateDto,
  ModeExistsDto,
  ModeParamsDto
> {
  constructor(
    private http: HttpClient,
    private modeStore: ModeStore,
    private modeQuery: ModeQuery
  ) {
    super(http, modeStore, modeQuery, {
      endPoint: 'mode',
    });
  }
}
