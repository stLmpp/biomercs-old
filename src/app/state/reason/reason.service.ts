import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import { Reason, ReasonAddDto, ReasonUpdateDto } from '../../model/reason';
import { HttpClient } from '@angular/common/http';
import { ReasonStore } from './reason.store';
import { ReasonQuery } from './reason.query';

@Injectable({ providedIn: 'root' })
export class ReasonService extends SuperService<Reason, ReasonAddDto, ReasonUpdateDto> {
  constructor(private http: HttpClient, private reasonStore: ReasonStore, private reasonQuery: ReasonQuery) {
    super({ http, store: reasonStore, query: reasonQuery, options: { endPoint: 'reason' } });
  }
}
