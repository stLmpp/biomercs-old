import { CommonColumns } from './common-history';
import { LabelValue } from './label-value';

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

export const rejectionMotives = (): LabelValue<ScoreApprovalRejectionMotiveEnum>[] => [
  {
    label: 'Lack of evidence',
    value: ScoreApprovalRejectionMotiveEnum.evidence,
  },
  {
    label: 'Cheating',
    value: ScoreApprovalRejectionMotiveEnum.cheat,
  },
  {
    label: 'Other',
    value: ScoreApprovalRejectionMotiveEnum.other,
  },
];

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

export interface ScoreApprovalAddManyDto extends Omit<ScoreApprovalAddDto, 'idScore'> {
  idScores: number[];
}
