import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StageStore } from './stage.store';
import { StageQuery } from './stage.query';
import { Stage, StageAddDto, StageParamsDto, StageUpdateDto } from '../../model/stage';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class StageService extends SuperService<
  Stage,
  StageAddDto,
  StageUpdateDto,
  StageParamsDto,
  StageParamsDto
> {
  constructor(private http: HttpClient, private stageStore: StageStore, private stageQuery: StageQuery) {
    super({
      http,
      store: stageStore,
      query: stageQuery,
      options: {
        endPoint: 'stage',
        file: {
          idKey: 'idImage',
          key: 'image',
        },
      },
    });
  }
}
