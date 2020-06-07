import { CommonColumns } from './common-history';
import { ReferenceTypeEnum } from './reference-type.enum';
import { ReportReason, ReportReasonAddDto } from './report-reason';
import { Reason } from './reason';

export interface Report extends CommonColumns {
  type: ReferenceTypeEnum;
  idReference: number;
  description?: string;
  reportReasons: ReportReason[];
}

export interface ReportAddDto {
  type: ReferenceTypeEnum;
  idReference: number;
  description?: string;
  reportReasons?: ReportReasonAddDto[];
  reasons?: Reason[];
}
