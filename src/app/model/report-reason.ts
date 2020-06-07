import { CommonColumns } from './common-history';
import { Reason } from './reason';
import { Report } from './report';

export interface ReportReason extends CommonColumns {
  idReason: number;
  reason?: Reason;
  idReport: number;
  report?: Report;
}

export interface ReportReasonAddDto {
  idReason: number;
  idReport?: number;
}
