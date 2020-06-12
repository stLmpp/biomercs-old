import { Injectable } from '@angular/core';
import { SuperService } from '../super/super-service';
import { Report, ReportAddDto } from '../../model/report';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReportService extends SuperService<Report, ReportAddDto> {
  constructor(private http: HttpClient) {
    super(http, { endPoint: 'report', excludeMethods: ['delete', 'findAll'] });
  }
}
