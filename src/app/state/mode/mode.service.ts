import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModeStore } from './mode.store';
import { Mode, ModeAddDto, ModeExistsDto, ModeParamsDto, ModeUpdateDto } from '../../model/mode';
import { ModeQuery } from './mode.query';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class ModeService extends SuperService<Mode, ModeAddDto, ModeUpdateDto, ModeExistsDto, ModeParamsDto> {
  constructor(private http: HttpClient, private modeStore: ModeStore, private modeQuery: ModeQuery) {
    super({
      http,
      store: modeStore,
      query: modeQuery,
      options: {
        endPoint: 'mode',
      },
    });
  }
}
