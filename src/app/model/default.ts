import { FileUpload } from './file-upload';

export interface Default {
  avatar: FileUpload;
  imageExtensions: string[];

  loading?: boolean;
}
