import { CommonColumns } from './common-history';
import { FileUpload } from './file-upload';
import { trackByFactory } from '@stlmpp/utils';
import { Site } from './site';

export interface ScorePlayerProof extends CommonColumns {
  url?: string;
  idImage?: number;
  image?: FileUpload;
  idSite?: number;
  site?: Site;
}

export interface ScorePlayerProofAddDto {
  url?: string;
  idSite?: number;
  idScorePlayer?: number;
  file?: FileList;
  idPlayer?: number;
}

export const trackByScorePlayerProof = trackByFactory<ScorePlayerProof>('id');
