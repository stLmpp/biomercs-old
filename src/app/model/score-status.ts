import { CommonColumns } from './common-history';

export interface ScoreStatus extends CommonColumns {
  description: string;
}

export enum ScoreStatusEnum {
  approved = 1,
  pendingUser,
  pendingAdmin,
  rejectedUser,
  rejectedAdmin,
}
