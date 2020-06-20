import { CommonColumns } from './common-history';

export interface ScoreApproval extends CommonColumns {
  status: ScoreApprovalStatusEnum;
  description?: string;
  rejectionMotive: ScoreApprovalRejectionMotiveEnum;
  idScore: number;
  active: boolean;
  type: ScoreApprovalTypeEnum;
}

export enum ScoreApprovalStatusEnum {
  approved = 'approved',
  rejected = 'rejected',
}

export enum ScoreApprovalRejectionMotiveEnum {
  evidence = 'evidence',
  cheat = 'cheat',
  other = 'other',
}

export enum ScoreApprovalTypeEnum {
  admin = 'admin',
  user = 'user',
}

export interface ScoreApprovalAddDto {
  idScore: number;
  status: ScoreApprovalStatusEnum;
  description?: string;
  rejectionMotive?: ScoreApprovalRejectionMotiveEnum;
  type?: ScoreApprovalTypeEnum;
}
