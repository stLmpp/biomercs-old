import { CommonColumns } from './common-history';
import { FileUpload } from './file-upload';
import { trackByFactory } from '../util/util';
import { Site } from './site';

export interface ScorePlayerProof extends CommonColumns {
  url: string;
  idImage?: number;
  image?: FileUpload;
  idSite?: number;
  site?: Site;
}

export const trackByScorePlayerProof = trackByFactory<ScorePlayerProof>('id');
