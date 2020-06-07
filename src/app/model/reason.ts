import { CommonColumns } from './common-history';
import { trackByFactory } from '../util/util';

export interface Reason extends CommonColumns {
  description: string;
}

export interface ReasonAddDto {
  description: string;
}

export type ReasonUpdateDto = Partial<ReasonAddDto>;

export const trackByReason = trackByFactory<Reason>('id');
